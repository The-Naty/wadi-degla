import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Tag, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';


const { Option } = Select;


const Users = () => {
    const [users, setUsers] = useState([]);
    const [addForm, viewAddForm] = useState(false);
    const [editForm, viewEditForm] = useState(false);
    const [userModal, viewUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [newUser, setNewUser] = useState({ email: "", password: "", userType: "", username: "" });

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const fetchProtectedData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/user/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newUser.email,
                    username: newUser.username,
                    password: newUser.password,
                    userType: newUser.userType,
                })

            });
            if (response.ok) {
                fetchProtectedData();
            } else {
                console.error('Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const editUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/user/update/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: editingUser.email,
                    username: editingUser.username,
                    userType: editingUser.userType,
                })
            });
            if (response.ok) {
                fetchProtectedData();
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id })
            });
            if (response.ok) {
                fetchProtectedData();
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchProtectedData();
    }, []);

    const onAdd = () => {
        viewAddForm(true);
    };

    const onDelete = (user) => {
        Modal.confirm({
            title: "Are you sure, you want to delete this user?",
            onOk: () => deleteUser(user._id),
            okText: "Yes",
            okType: "danger"
        });
    };

    const onEdit = (user) => {
        viewEditForm(true);
        setEditingUser({ ...user });
    };

    const onView = async (user) => {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/user/getUser/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
              
            });
            const data = await response.json();
            if (response.ok) {
                setViewUser(data);
                viewUserModal(true);
            } else {
                console.error('Failed to fetch user details:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            key: 1,
            title: "ID",
            dataIndex: "_id",
            render: (text) => text.substring(0, 5),
            sorter: (record1, record2) => record1._id > record2._id,
        },
        {
            key: 2,
            title: "Name",
            dataIndex: "username",
            sorter: (record1, record2) => record1.username > record2.username
        },
        {
            key: 3,
            title: "Email",
            dataIndex: "email",
            sorter: (record1, record2) => record1.email > record2.email
        },
        {
            key: 4,
            title: "Role",
            dataIndex: "userType",
            render: (userType) => renderUserTypeTag(userType),
            sorter: (record1, record2) => record1.userType < record2.userType
        },
        {
            key: 5,
            title: "Actions",
            render: (record) => (
                <>
                    <EyeOutlined onClick={() => onView(record)} style={{color:"blue", cursor: "pointer" }} />
                    <EditOutlined onClick={() => onEdit(record)} style={{ cursor: "pointer", marginLeft: 12 }} />
                    <DeleteOutlined onClick={() => onDelete(record)} style={{ color: "red", marginLeft: 12, cursor: "pointer" }} />
                </>
            )
        }
    ];

    const renderStatusTag = (status) => {
        let color;
        switch (status) {
            case 'REQUESTED':
                color = 'blue';
                break;
            case 'CONFIRMED':
                color = 'green';
                break;
            case 'CANCELED':
                color = 'red';
                break;
            case 'IN_PROGRESS':
                color = 'orange';
                break;
            case 'DONE':
                color = 'cyan';
                break;
            default:
                color = 'default';
                break;
        }
        return <Tag color={color}>{status}</Tag>;
    };

    const renderUserTypeTag = (userType) => {
        const colorMap = {
            'SUPER_ADMIN': 'blue',
            'ADMIN': 'green',
            'MODERATOR': 'orange',
            'CUSTOMER': 'cyan',
            'SALESPERSON': 'purple'
        };
        return <Tag color={colorMap[userType]}>{userType}</Tag>;
    };

    return (
        <div style={{ width: '100%' }}>
        <title>Users - Wadi Degla</title>
        {isMobile ? (
            <div>
                {users.map(user => (
                    <div key={user._id} style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: 16, marginBottom: 16 }}>
                        <p><strong>ID:</strong> {user._id.substring(0, 5)}</p>
                        <p><strong>Name:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {renderUserTypeTag(user.userType)}</p>
                        <div>
                            <EyeOutlined onClick={() => onView(user)} style={{ color: 'blue', cursor: 'pointer' }} />
                            <EditOutlined onClick={() => onEdit(user)} style={{ cursor: 'pointer', marginLeft: 12 }} />
                            <DeleteOutlined onClick={() => onDelete(user)} style={{ color: 'red', marginLeft: 12, cursor: 'pointer' }} />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <Table
                columns={columns}
                dataSource={users}
                pagination={{ pageSize: 10 }}
            />
        )}
            <Button onClick={onAdd} style={{ marginBottom: "0" }}>Add new user</Button>

            <Modal
                title="Add user"
                open={addForm}
                onCancel={() => { viewAddForm(false); }}
                onOk={() => {
                    addUser();
                    viewAddForm(false);
                    setNewUser({ email: "", password: "", userType: "", username: "" });
                }}
                okText="Add"
            >
                <Input
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    value={newUser.username}
                    style={{ marginTop: 25 }}
                    allowClear
                    addonBefore='Username'
                />
                <Input
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    value={newUser.email}
                    style={{ marginTop: 20 }}
                    allowClear
                    addonBefore='Email'
                />
                <Input
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    value={newUser.password}
                    style={{ marginTop: 20 }}
                    allowClear
                    addonBefore='Password'
                />
                <Select
                    style={{ marginTop: 20, width: '100%' }}
                    placeholder="Role"
                    onChange={(value) => setNewUser({ ...newUser, userType: value })}
                >
                    <Option value="SUPER_ADMIN">SUPER ADMIN</Option>
                    <Option value="ADMIN">ADMIN</Option>
                    <Option value="MODERATOR">MODERATOR</Option>
                    <Option value="CUSTOMER">CUSTOMER</Option>
                    <Option value="SALESPERSON">SALESPERSON</Option>
                </Select>
            </Modal>

            <Modal
                title="Edit user"
                open={editForm}
                onCancel={() => { viewEditForm(false); }}
                onOk={() => {
                    editUser();
                    viewEditForm(false);
                }}
                okText="Save"
            >
                <Input
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    value={editingUser?.username}
                    style={{ marginTop: 25 }}
                    allowClear
                    addonBefore='Username'
                />
                <Input
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    value={editingUser?.email}
                    style={{ marginTop: 20 }}
                    allowClear
                    addonBefore='Email'
                />
                <Select
                    style={{ marginTop: 20, width: '100%' }}
                    placeholder="Role"
                    value={editingUser?.userType}
                    onChange={(value) => setEditingUser({ ...editingUser, userType: value })}
                >
                    <Option value="SUPER_ADMIN">SUPER ADMIN</Option>
                    <Option value="ADMIN">ADMIN</Option>
                    <Option value="MODERATOR">MODERATOR</Option>
                    <Option value="CUSTOMER">CUSTOMER</Option>
                    <Option value="SALESPERSON">SALESPERSON</Option>
                </Select>
            </Modal>

            <Modal
                title="User Details"
                open={userModal}
                onCancel={() => { viewUserModal(false); setViewUser(null); }}
                footer={null}
            >
                {viewUser && (
                    <div>
                        <p style={{marginTop:30 }}><strong>Username:</strong> {viewUser.username}</p>
                        <p style={{marginTop:20 }}><strong>Email:</strong> {viewUser.email}</p>
                        <p style={{marginTop:20 }}><strong>Role:</strong> {viewUser.userType}</p>
                        <h3 style={{marginTop:40 }}>Orders:</h3>
                        <Table
                            columns={[
                                { title: 'Order ID', dataIndex: '_id', key: '_id' },
                                { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
                                { title: 'Status', dataIndex: 'status',render: (status) => renderStatusTag(status), key: 'status' },

                            ]}
                            dataSource={viewUser.orders}
                            rowKey={(record) => record._id}
                            pagination={false}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Users;
