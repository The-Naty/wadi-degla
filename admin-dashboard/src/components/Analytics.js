import React, { useState, useEffect } from 'react';
import { Space, Card } from 'antd';
import Statistic from 'antd/es/statistic/Statistic';
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction='horizontal'>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

const Analytics = () => {
  const [usersTotal, setUsersTotal] = useState();
  const [productsTotal, setProductsTotal] = useState();
  const [ordersTotal, setOrdersTotal] = useState();

  async function getData(name) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://wadidegla-q264.onrender.com/api/${name}/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (name === 'user') setUsersTotal(data.length);
        if (name === 'product') setProductsTotal(data.length);
        if (name === 'order') setOrdersTotal(data.length);
      } else {
        console.error('Failed to fetch data:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getData('user');
    getData('product');
    getData('order');
  }, []);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const direction = isMobile ? 'vertical' : 'horizontal';

  return (
    <div>
      <title>Dashboard - Wadi Degla</title>

      <Space direction={direction}>
        <DashboardCard
          title="Orders"
          value={ordersTotal}
          icon={<ShoppingCartOutlined style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />}
        />
        {/* <DashboardCard
          title="Products"
          value={productsTotal}
          icon={<ShoppingOutlined style={{ color: 'blue', backgroundColor: 'rgba(0,0,255,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />}
        /> */}
        <DashboardCard
          title="Users"
          value={usersTotal}
          icon={<UserOutlined style={{ color: 'purple', backgroundColor: 'rgba(0,255,255,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />}
        />
      </Space>
    </div>
  );
};

export default Analytics;
