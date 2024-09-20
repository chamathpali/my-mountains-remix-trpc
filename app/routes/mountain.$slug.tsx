import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Mountain Page" },
        { name: "description", content: "This is a mountain page" },
    ];
};

export default function Mountain() {

    return <>Mountain</>;
}