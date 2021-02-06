import React, { SyntheticEvent } from "react";
import { loadList } from "../../store/loaders";
import { useDispatch } from "react-redux";

type ListCardProps = {
    lists: Array<string>
}

export function ListCard(props: ListCardProps) {
    const {lists} = props;
    const dispatch = useDispatch();
    const handleOpenList = (e: SyntheticEvent) => {
        dispatch(loadList(e.target.innerHTML));
    }
    return(
        <section className="bg-primary h-full rounded-md">
            <h1 className="text-primary text-center uppercase m-5 text-lg">Lists</h1>
            <ul className="text-primary text-center list-none">
                {
                    lists?.map((l: string) => {
                        return (
                            <li key={l}>
                                <button onClick={handleOpenList} className="m-4 uppercase text-primary whitespace-no-wrap truncate hover:text-hover text-base">{l}</button>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    );
}