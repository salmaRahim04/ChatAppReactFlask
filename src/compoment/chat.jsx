import { PrettyChatWindow } from 'react-chat-engine-pretty';
import "../App.css"
import Navbar from './Header';

const ChatsPage = (props) => {
    console.log(props)
    return (
       <div>
         <Navbar/> 
         <div className="background">
            <div className='chat-wrapper'>
                <PrettyChatWindow
                     projectId={"e2654d19-4929-458a-a0d4-64f5b653fb3b"}
                    username={props.username} 
                    secret={props.user}
                    style={{ height: "100%" }}
                />
            </div>
        </div>
       </div>
    );
}

export default ChatsPage