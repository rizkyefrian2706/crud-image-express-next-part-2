import FormPost from "../components/FormPost";

export default function create_Post(props) {
    return (
        <div>
            <div className="container mx-auto px-4 max-w-screen-sm">
                <FormPost action='add'></FormPost>
            </div>
        </div>
    )
}