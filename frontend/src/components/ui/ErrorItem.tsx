
type ErrorProps={
    errors: string[]
}

export function ErrorItem({errors}:ErrorProps){
    if (errors.length === 0) return null;
    return (
        <ul className="add-edit-errors">
            {errors.map((e:string, i:number) => (
                <li className="text-s" key={i}>{e}</li>
            ))}
        </ul>
    )
}