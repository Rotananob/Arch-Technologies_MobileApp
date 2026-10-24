import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../src/events/events.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('EventsService (Unit Tests)', () => {
  let eventsService: EventsService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrisma = {
      event: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      savedEvent: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
      },
      eventRegistration: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    prismaService = module.get(PrismaService);
  });

  it('should throw NotFoundException if event does not exist when registering', async () => {
    prismaService.event.findUnique.mockResolvedValue(null);

    await expect(
      eventsService.registerUserForEvent('invalid-id', 'user-id'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if event does not require registration', async () => {
    prismaService.event.findUnique.mockResolvedValue({
      id: 'event-1',
      isRegistrationRequired: false,
      _count: { registrations: 0 },
    });

    await expect(
      eventsService.registerUserForEvent('event-1', 'user-id'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if user is already registered', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    prismaService.event.findUnique.mockResolvedValue({
      id: 'event-1',
      isRegistrationRequired: true,
      startDate: futureDate,
      maxCapacity: 100,
      _count: { registrations: 5 },
    });

    prismaService.eventRegistration.findUnique.mockResolvedValue({
      id: 'reg-1',
      status: 'REGISTERED',
    });

    await expect(
      eventsService.registerUserForEvent('event-1', 'user-id'),
    ).rejects.toThrow(ConflictException);
  });
});
