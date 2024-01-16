import { Offline} from 'react-detect-offline';
import './ConnectionStatusAlert.css'


const ConnectionStatusAlert = () => {


  return (
    <div>
      
      <Offline>
        <div className="offline-status">You're Offline. 🛜 Check your Internet Connection and try again!</div>
      </Offline>
    </div>
  );
};
export default ConnectionStatusAlert;
