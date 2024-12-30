import { faker } from "@faker-js/faker";
import { range } from "lodash";

export type Person = {
    id: number;
    name: string;
    title: string;
    email: string;
};

export const makeData = (cnt: number) => {
    const items = range(0, cnt);

    const data = items.map((i) => ({
        id: i,
        name: faker.person.fullName(),
        title: faker.person.jobTitle(),
        email: faker.internet.email(),
    }));
    return data;
};

