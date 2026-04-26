import { useEffect, useRef } from "react";
import Client from "../api/client.ts";

type Props = {
    items: any[],
    setItems: (v: any) => void,
    link?: string,
    textRes: string,
    search?: string
};

export function useInfiniteScrollOnScroll({
                                              items,
                                              setItems,
                                              link,
                                              textRes,
                                              search
                                          }: Props) {

    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const itemsRef = useRef(items);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(() => {
        hasMoreRef.current = true;
        isFetchingRef.current = false;
    }, [link]);

    useEffect(() => {
        function onScroll() {
            if (isFetchingRef.current) return;
            if (!hasMoreRef.current) return;

            if (isFetchingRef.current) return;
            if (!hasMoreRef.current) return;
            if (!link) return;

            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            const nearBottom = scrollTop + clientHeight >= scrollHeight - 200;
            if (!nearBottom) return;
            isFetchingRef.current = true;

            const lastItem = itemsRef.current[itemsRef.current.length - 1];
            const cursorId = lastItem?.id;

            const getLink = ()=>{
                if(cursorId && search) return `${link}?search=${search}&cursorId=${cursorId}`
                if(cursorId && !search) return `${link}?cursorId=${cursorId}`
                return link
            }
            Client(
                getLink(),
                "GET"
            )
                .then((response) => {
                    const data = response?.[textRes];

                    if (data) {
                        if (data.length < 20) {
                            hasMoreRef.current = false;
                        }

                        setItems((prev: any[]) => {
                            const existing = new Set(prev.map(p => p.id));
                            const filtered = data.filter((d: any) => !existing.has(d.id));
                            return [...prev, ...filtered];
                        });
                    }
                })
                .finally(() => {
                    isFetchingRef.current = false;
                });
        }

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);

    }, [link, textRes, setItems]);
}