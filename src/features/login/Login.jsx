import { Button, Input, Form, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from '../api/apiSlice'

export default function Login() {
  let navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      localStorage.setItem('user', JSON.stringify(values))
      const result = await login();
      console.log(result);
      if (result.data) {
        // Successfuly authorized
        navigate('/dashboard')
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(100vh - 50pt)', alignItems: 'center' }}>
      <Form
        id="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="current-password"
        style={{ width: '350pt' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Пожалуйста введите Email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginTop: '20pt' }}>
            Войти
          </Button>
        </Form.Item>
        <h4 style={{opacity: isLoading || error ? 1 : 0, color: error ? '#ff4d4f' : 'black'}}>{error ? (error.status == "FETCH_ERROR" ? "Произошла внутренняя ошибка сервера" : "Неправильный логин или пароль") : "Вход..."}</h4>
      </Form>
    </div>
  );
}