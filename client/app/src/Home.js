import './Home.css';
import { Link } from "react-router-dom";

export default function Home()
{
    window.sessionStorage.setItem("name", "Anonimo");
    return(
            <div className='homeDiv'>
                <h1 className='homeH1'>.CHAT</h1>
                <form className='homeForm'>
                    <input
                    placeholder="Type a name..."
                    required
                    className='homeInput'
                    onChange={(event) => {
                        window.sessionStorage.setItem("name", event.target.value);
                    }}
                    />
                    <Link to={"/chat"}><button className='homeButton'>Conversar</button></Link>
                </form>
            </div>
        
    );
}
