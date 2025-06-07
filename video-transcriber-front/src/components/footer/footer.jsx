import { Button } from '@mui/material';
import './footer.css';
import GithubAvatar from '../github-avatar/github-avatar';

export default function Footer() {
    return (
        <div className="footer-wrapper">
            <div className="footer-main">
                <Button variant="outlined"
                    href="https://github.com/Yuranium">
                    <div className="contributors">
                        <GithubAvatar username="Yuranium"/>
                        <p>Yuranium</p>
                    </div>
                </Button>
                <Button variant="outlined"
                    href="https://github.com/PTSVU">
                    <div className="contributors">
                        <GithubAvatar username="PTSVU"/>
                        <p>PTSVU</p>
                    </div>
                </Button>
            </div>
        </div>
    )
}