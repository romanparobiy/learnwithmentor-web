export class Comment {
    Id: number;
    Text: string;
    CreatorId: number;
    CreatorFirstName: string;
    CreatorLastName: string;
    CreateDate: DateTimeFormat;
    ModDate: DateTimeFormat;
    isRead: boolean;
}
