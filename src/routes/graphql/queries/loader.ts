import DataLoader from 'dataloader';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';

export default class Loader {
    readonly memberLoader: DataLoader<string, MemberType | undefined>;
    readonly userLoader: DataLoader<string, User | undefined>;
    readonly subscribedLoader: DataLoader<string, User[] | undefined>;
    readonly subscribersLoader: DataLoader<string, User[] | undefined>;
    readonly postLoader: DataLoader<string, Post | undefined>;
    readonly userPostsLoader: DataLoader<string, Post[] | undefined>;
    readonly profileLoader: DataLoader<string, Profile | undefined>;
    readonly userProfileLoader: DataLoader<string, Profile | undefined>;

    constructor(db: PrismaClient) {
        this.memberLoader = new DataLoader(async (keys) => {
            const result = await db.memberType.findMany({
                where: { id: { in: keys as string[] } },
            });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.userLoader = new DataLoader(async (keys) => {
            const result = await db.user.findMany({ where: { id: { in: keys as string[] } } });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.subscribedLoader = new DataLoader(async (keys) => {
            const result = await db.subscribersOnAuthors.findMany({
                where: { subscriberId: { in: keys as string[] } },
                select: { author: true, subscriberId: true },
            });
            return keys.map((key) =>
                result
                    .filter((sub) => key === sub.subscriberId)
                    .map((sub) => {
                        this.userLoader.prime(sub.author.id, sub.author);
                        return sub.author;
                    }),
            );
        });
        this.subscribersLoader = new DataLoader(async (keys) => {
            const result = await db.subscribersOnAuthors.findMany({
                where: { authorId: { in: keys as string[] } },
                select: { subscriber: true, authorId: true },
            });
            return keys.map((key) =>
                result
                    .filter((sub) => key === sub.authorId)
                    .map((sub) => {
                        this.userLoader.prime(sub.subscriber.id, sub.subscriber);
                        return sub.subscriber;
                    }),
            );
        });
        this.postLoader = new DataLoader(async (keys) => {
            const result = await db.post.findMany({ where: { id: { in: keys as string[] } } });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.userPostsLoader = new DataLoader(async (keys) => {
            const res = await db.post.findMany({
                where: { authorId: { in: keys as string[] } },
            });
            return keys.map((id) => res.filter((post) => id === post.authorId));
        });
        this.profileLoader = new DataLoader(async (keys) => {
            const result = await db.profile.findMany({ where: { id: { in: keys as string[] } } });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.userProfileLoader = new DataLoader(async (keys) => {
            const res = await db.profile.findMany({
                where: { userId: { in: keys as string[] } },
            });
            return keys.map((id) => res.find((post) => id === post.userId));
        });
    }
}