import { Body, Controller, Inject, Injectable, Module, Post, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { z } from 'zod';

export const OWNER_REPOSITORY = Symbol('OWNER_REPOSITORY');
interface NewOwner { fullName: string; email: string; phone: string; passwordHash: string; referralCode: string; referredById?: string }
export interface OwnerRepository {
  findReferrer(code: string): Promise<{ id: string } | null>;
  create(data: NewOwner): Promise<{ id: string }>;
}
const inputSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/),
  password: z.string().min(12).max(128),
  referralCode: z.string().trim().max(64).optional(),
});
@Injectable()
export class PrismaOwnerRepository implements OwnerRepository {
  private client?: PrismaClient;
  private db() { return this.client ??= new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) }); }
  findReferrer(code: string) { return this.db().owner.findUnique({ where: { referralCode: code }, select: { id: true } }); }
  create(data: NewOwner) { return this.db().owner.create({ data, select: { id: true } }); }
  async onModuleDestroy() { await this.client?.$disconnect(); }
}
@Injectable()
export class OwnerRegistrationService {
  constructor(@Inject(OWNER_REPOSITORY) private readonly owners: OwnerRepository) {}
  async register(input: unknown) {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) throw new BadRequestException('Check your registration details.');
    const { password, referralCode, ...profile } = parsed.data;
    const referrer = referralCode ? await this.owners.findReferrer(referralCode) : null;
    if (referralCode && !referrer) throw new UnprocessableEntityException('Invalid referral code.');
    const salt = randomBytes(16).toString('hex');
    const hash = await promisify(scrypt)(password, salt, 64) as Buffer;
    try {
      const owner = await this.owners.create({ ...profile, passwordHash: `scrypt:${salt}:${hash.toString('hex')}`, referralCode: randomBytes(12).toString('hex'), referredById: referrer?.id });
      return { id: owner.id, phoneVerified: false };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') throw new ConflictException('An account already exists.');
      throw error;
    }
  }
}
@Controller('api/owners')
class OwnersController {
  constructor(private readonly registration: OwnerRegistrationService) {}
  @Post()
  create(@Body() body: unknown) { return this.registration.register(body); }
}
@Module({ controllers: [OwnersController], providers: [OwnerRegistrationService, { provide: OWNER_REPOSITORY, useClass: PrismaOwnerRepository }] })
export class OwnersModule {}
