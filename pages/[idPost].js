import FormPost from "../components/FormPost";
import User from "./api/user";
 
export default function EditPost(props) {  
    return (
        <div>
             <div className="container mx-auto px-4 max-w-screen-sm">
                <FormPost action='update' dataPost={props.data}></FormPost>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) { 
    const { idPost } = context.query;
    if (idPost) { 
        const data = await User.getOneData(idPost); 
        return {
            props: { data }
        }
    }

}