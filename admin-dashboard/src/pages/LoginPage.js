import React from 'react';
import { Row, Col } from 'antd';
import LoginForm from '../components/LoginForm';

const LoginPage = () => (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
            <LoginForm />
        </Col>
    </Row>
);

export default LoginPage;
