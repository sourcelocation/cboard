import { Link } from "react-router-dom";
import './HomePage.css'
import HomeTopBg from '../../images/Home-Top-Bg.png'
import { CButton } from "../elements/CButton";
import CboardIcon from '../../images/CboardIcon.png'
import { Button } from "@mantine/core";

const containerStyle = {
  margin: 0,
  color: 'white',
  background: '#506BF1'
}
const sectionStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '400px',
  padding: '100px 20vw'
}

export default function HomePage() {
  return (
    <div>
      <div>
        <img src={HomeTopBg} class="relative block h-auto max-w-full align-middle" />
        <div class="absolute top-40 left-24">
          <img src={CboardIcon} style={{ height: '80px', marginBottom: '10px' }} />
          <h1 style={{ fontSize: '3.25em', fontWeight: 800 }}>Create schedules<br />with <span style={{ color: "#5F5AFF" }}>right tools.</span></h1>
          <h1 style={{ fontSize: '1.25em', fontWeight: 300, color: 'gray', width: '25vw' }}>Cboard does <span style={{ fontWeight: 800 }}>most of the work for you</span>, allowing you to come up with new creative ideas for your next big project.</h1>
          <div>
            <CButton title={"Get started"} filled={true} width="40%" height={48} onClick={() => console.log("Clicked")} />
            <CButton title={"Learn more"} filled={false} width="40%" height={48} onClick={() => console.log("Clicked")} style={{ marginLeft: '24px' }} />
          </div>
        </div>
      </div>

    </div>
  )
}
