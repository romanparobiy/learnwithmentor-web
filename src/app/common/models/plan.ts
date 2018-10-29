export class Plan {
    Id: number;
    Name: string;
    Description: string;
    Published: boolean;
    CreatorId: number;
    CreatorFirstName: string;
    CreatorLastName: string;
    ModifierId: number;
    ModifierFirstName: string;
    ModifierLstName: string;
    CreateDate: Date;
    ModDate: Date;
    IsPrivate: boolean;
}
