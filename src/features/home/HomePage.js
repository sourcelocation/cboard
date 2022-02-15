import { Button } from "antd";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (<div>
    <h3 style={{ margin: '30pt 0 16pt 0' }}>cboard - Бета тест</h3>
    <Link to={'/login'}>
      <Button type='primary'>
        Войти в аккаунт
      </Button>
    </Link>
  </div>)
}