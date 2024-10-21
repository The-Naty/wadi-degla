import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, Space , Spin , Select ,Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, FileOutlined, EyeOutlined  } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [addForm, viewAddForm] = useState(false);
    const [editForm, viewEditForm] = useState(false);
    const [orderModal, viewOrderModal] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [documentsChoice, setDocumentsChoice] = useState(false);
    const [exportID, setExportID] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [newOrder, setNewOrder] = useState({
        status: '',
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerEmail: '',
        customerTaxId: '',
        shippingType: '',
        shippingPort: '',
        PaymentTerms: '',
        ShippingTerms: '',
        products: [],
        boxes: [],
        RNC: '',
        notify: '',
        containerNumber: '',
        comments: '',
        shipmentTotalContainers: '',
        totalBoxes: '',
        netWeight: '',
        grossWeight: '',
        discount: '',
        total: '',
        totalMeters: '',
        offerPrice: '',
        ShipmentFees: ''
    });

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/order/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newOrder)
            });
            if (response.ok) {
                fetchOrders();
            } else {
                console.error('Failed to add order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const editOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/order/update/${editingOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editingOrder)
            });
            if (response.ok) {
                fetchOrders();
            } else {
                console.error('Failed to update order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteOrder = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/order/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                
            });
            if (response.ok) {
                fetchOrders();
            } else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const exportOrder = async (type) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/order/${type}/${exportID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${type}.pdf`; // You can set the name of the PDF file here
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to fetch the PDF file.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    


    useEffect(() => {
        fetchOrders();
    }, []);

    const onAdd = () => {
        viewAddForm(true);
    };

    const onDelete = (order) => {
        Modal.confirm({
            title: "Are you sure you want to delete this order?",
            onOk: () => {
                deleteOrder(order._id);
            },
            okText: "Yes",
            okType: "danger"
        });
    };

    const onEdit = (order) => {
        viewEditForm(true);
        setEditingOrder({ ...order });
    };

    const onExport = (order) => {

        setExportID(order._id);
        setDocumentsChoice(true);  

    }

    const onView = async (order) => {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/order/find/${order._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
              
            });
            const data = await response.json();
            if (response.ok) {
                setViewOrder(data);
                viewOrderModal(true);
            } else {
                console.error('Failed to fetch user details:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        { key: 1, title: "ID", dataIndex: "_id", render: (text) => text.substring(0, 5), sorter: (a, b) => a._id > b._id },
        { key: 2, title: "Customer Name", dataIndex: "customerName", sorter: (a, b) => a.customerName > b.customerName },
        { key: 3, title: "Customer Email", dataIndex: "customerEmail", sorter: (a, b) => a.customerEmail > b.customerEmail },
        { key: 4, title: "Status", dataIndex: "status", render: (status) => renderStatusTag(status), sorter: (a, b) => a.status > b.status },
        { key: 5, title: "Actions", render: (record) => (
            <>  
                <EyeOutlined onClick={() => onView(record)} style={{ color:"blue", cursor: "pointer" }} />
                <EditOutlined onClick={() => onEdit(record)} style={{  cursor: "pointer" , marginLeft: 12 }} />
                <DeleteOutlined onClick={() => onDelete(record)} style={{ color: "red", marginLeft: 12, cursor: "pointer" }} />
                <FileOutlined onClick={() => onExport(record)} style={{color:"yellow" , marginLeft: 12, cursor: "pointer" }} />

            </>
        ) },
    ];

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...newOrder.products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setNewOrder({ ...newOrder, products: updatedProducts });
    };

    const handleBoxChange = (index, field, value) => {
        const updatedBoxes = [...newOrder.boxes];
        updatedBoxes[index] = { ...updatedBoxes[index], [field]: value };
        setNewOrder({ ...newOrder, boxes: updatedBoxes });
    };

    const handleEditProductChange = (index, field, value) => {
        const updatedProducts = [...editingOrder.products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setEditingOrder({ ...editingOrder, products: updatedProducts });
    };

    const handleEditBoxChange = (index, field, value) => {
        const updatedBoxes = [...editingOrder.boxes];
        updatedBoxes[index] = { ...updatedBoxes[index], [field]: value };
        setEditingOrder({ ...editingOrder, boxes: updatedBoxes });
    };

    const ExportButtonWithSpin = ({ exportType , name } ) => {
        const [loading, setLoading] = useState(false);
    
        const exportOrder = async (type) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            setLoading(true);
    
            try {
                const response = await fetch(`https://wadidegla-q264.onrender.com/api/order/${type}/${exportID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${name}.pdf`; // You can set the name of the PDF file here
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    console.error(`Failed to fetch the ${type} PDF file.`);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
    
        return (
            <Spin spinning={loading}>
                <Button onClick={() => exportOrder(exportType)} type='primary' disabled={loading}>
                    {name}
                </Button>
            </Spin>
        );
    };

    const [statusOptions] = useState(['REQUESTED', 'CONFIRMED', 'CANCELED', 'IN_PROGRESS', 'DONE']);


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


    return (
        <div style={{ width: "100%" }}>

        <title>Orders - Wadi Degla</title>

        {isMobile ? (
            <div>
                {orders.map(order => (
                    <div key={order._id} style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: 16, marginBottom: 16 }}>
                        <p><strong>ID:</strong> {order._id.substring(0, 5)}</p>
                        <p><strong>Customer Name:</strong> {order.customerName}</p>
                        <p><strong>Customer Email:</strong> {order.customerEmail}</p>
                        <p><strong>Status:</strong> {renderStatusTag(order.status)}</p>
                        <div>
                            <EyeOutlined onClick={() => onView(order)} style={{ color: 'blue', cursor: 'pointer' }} />
                            <EditOutlined onClick={() => onEdit(order)} style={{ cursor: 'pointer', marginLeft: 12 }} />
                            <DeleteOutlined onClick={() => onDelete(order)} style={{ color: 'red', marginLeft: 12, cursor: 'pointer' }} />
                            <FileOutlined onClick={() => onExport(order)} style={{color:"yellow" , marginLeft: 12, cursor: "pointer" }} />

                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <Table
                columns={columns}
                dataSource={orders}
                pagination={{ pageSize: 10 }}
            />
        )}
            <Button onClick={onAdd} style={{ marginBottom: "0" }}>Add new order</Button>

            <Modal
                title="Add Order"
                open={addForm}
                onCancel={() => { viewAddForm(false); }}
                onOk={() => {
                    addOrder();
                    viewAddForm(false);
                    setNewOrder({
                        status: '',
                        customerName: '',
                        customerAddress: '',
                        customerPhone: '',
                        customerEmail: '',
                        customerTaxId: '',
                        shippingType: '',
                        shippingPort: '',
                        PaymentTerms: '',
                        ShippingTerms: '',
                        orders: [],
                        boxes: [],
                        RNC: '',
                        notify: '',
                        containerNumber: '',
                        comments: '',
                        shipmentTotalContainers: '',
                        totalBoxes: '',
                        netWeight: '',
                        grossWeight: '',
                        discount: '',
                        total: '',
                        totalMeters: '',
                        offerPrice: '',
                        ShipmentFees: ''
                    });
                }}
                okText="Add"
            >
                <Form layout="vertical">
                <Form.Item label="Status">
                <Select value={newOrder.status} onChange={(value) => setNewOrder({ ...newOrder, status: value })}>
                    {statusOptions.map((status) => (
                        <Option key={status} value={status}>{status}</Option>
                    ))}
                </Select>
            </Form.Item>
                    <Form.Item label="Customer Name">
                        <Input value={newOrder.customerName} onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Email">
                        <Input value={newOrder.customerEmail} onChange={e => setNewOrder({ ...newOrder, customerEmail: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Address">
                        <Input value={newOrder.customerAddress} onChange={e => setNewOrder({ ...newOrder, customerAddress: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Phone">
                        <Input value={newOrder.customerPhone} onChange={e => setNewOrder({ ...newOrder, customerPhone: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Tax ID">
                        <Input value={newOrder.customerTaxId} onChange={e => setNewOrder({ ...newOrder, customerTaxId: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Type">
                        <Input value={newOrder.shippingType} onChange={e => setNewOrder({ ...newOrder, shippingType: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Port">
                        <Input value={newOrder.shippingPort} onChange={e => setNewOrder({ ...newOrder, shippingPort: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Payment Terms">
                        <Input value={newOrder.PaymentTerms} onChange={e => setNewOrder({ ...newOrder, PaymentTerms: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Terms">
                        <Input value={newOrder.ShippingTerms} onChange={e => setNewOrder({ ...newOrder, ShippingTerms: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="RNC">
                        <Input value={newOrder.RNC} onChange={e => setNewOrder({ ...newOrder, RNC: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Notify">
                        <Input value={newOrder.notify} onChange={e => setNewOrder({ ...newOrder, notify: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Container Number">
                        <Input value={newOrder.containerNumber} onChange={e => setNewOrder({ ...newOrder, containerNumber: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Comments">
                        <Input value={newOrder.comments} onChange={e => setNewOrder({ ...newOrder, comments: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipment Total Containers">
                        <Input value={newOrder.shipmentTotalContainers} onChange={e => setNewOrder({ ...newOrder, shipmentTotalContainers: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total Boxes">
                        <Input value={newOrder.totalBoxes} onChange={e => setNewOrder({ ...newOrder, totalBoxes: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Net Weight">
                        <Input value={newOrder.netWeight} onChange={e => setNewOrder({ ...newOrder, netWeight: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Gross Weight">
                        <Input value={newOrder.grossWeight} onChange={e => setNewOrder({ ...newOrder, grossWeight: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Discount">
                        <Input value={newOrder.discount} onChange={e => setNewOrder({ ...newOrder, discount: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total">
                        <Input value={newOrder.total} onChange={e => setNewOrder({ ...newOrder, total: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total Meters">
                        <Input value={newOrder.totalMeters} onChange={e => setNewOrder({ ...newOrder, totalMeters: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Offer Price">
                        <Input value={newOrder.offerPrice} onChange={e => setNewOrder({ ...newOrder, offerPrice: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipment Fees">
                        <Input value={newOrder.ShipmentFees} onChange={e => setNewOrder({ ...newOrder, ShipmentFees: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Products">
                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                                <>

    
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Input
                                                placeholder="Product Name"
                                                value={newOrder.products[index]?.name || ''}
                                                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Quantity"
                                                value={newOrder.products[index]?.quantity || ''}
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Price"
                                                value={newOrder.products[index]?.price || ''}
                                                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                            />
                                             <Input
                                                placeholder="length"
                                                value={newOrder.products[index]?.length || ''}
                                                onChange={(e) => handleProductChange(index, 'length', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Height"
                                                value={newOrder.products[index]?.height || ''}
                                                onChange={(e) => handleProductChange(index, 'height', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Weight"
                                                value={newOrder.products[index]?.weight || ''}
                                                onChange={(e) => handleProductChange(index, 'weight', e.target.value)}
                                            />
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Product
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                    <Form.Item label="Boxes">
                        <Form.List name="boxes">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Input
                                                placeholder="Box Name"
                                                value={newOrder.boxes[index]?.name || ''}
                                                onChange={(e) => handleBoxChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Tiles"
                                                value={newOrder.boxes[index]?.tiles || ''}
                                                onChange={(e) => handleBoxChange(index, 'tiles', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Length"
                                                value={newOrder.boxes[index]?.length || ''}
                                                onChange={(e) => handleBoxChange(index, 'length', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Height"
                                                value={newOrder.boxes[index]?.height || ''}
                                                onChange={(e) => handleBoxChange(index, 'height', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Total"
                                                value={newOrder.boxes[index]?.total || ''}
                                                onChange={(e) => handleBoxChange(index, 'total', e.target.value)}
                                            />
                                            
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Box
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Order"
                open={editForm}
                onCancel={() => { viewEditForm(false); }}
                onOk={() => {
                    editOrder();
                    viewEditForm(false);
                }}
                okText="Save"
            >
                <Form layout="vertical">
                    <Form.Item label="Status">

                    <Select value={editingOrder?.status} onChange={(value) => setEditingOrder({ ...editingOrder, status: value })}>
                    {statusOptions.map((status) => (
                        <Option key={status} value={status}>{status}</Option>
                    ))}
                </Select>

                    </Form.Item>
                    <Form.Item label="Customer Name">
                        <Input value={editingOrder?.customerName} onChange={e => setEditingOrder({ ...editingOrder, customerName: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Email">
                        <Input value={editingOrder?.customerEmail} onChange={e => setEditingOrder({ ...editingOrder, customerEmail: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Address">
                        <Input value={editingOrder?.customerAddress} onChange={e => setEditingOrder({ ...editingOrder, customerAddress: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Phone">
                        <Input value={editingOrder?.customerPhone} onChange={e => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Customer Tax ID">
                        <Input value={editingOrder?.customerTaxId} onChange={e => setEditingOrder({ ...editingOrder, customerTaxId: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Type">
                        <Input value={editingOrder?.shippingType} onChange={e => setEditingOrder({ ...editingOrder, shippingType: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Port">
                        <Input value={editingOrder?.shippingPort} onChange={e => setEditingOrder({ ...editingOrder, shippingPort: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Payment Terms">
                        <Input value={editingOrder?.PaymentTerms} onChange={e => setEditingOrder({ ...editingOrder, PaymentTerms: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipping Terms">
                        <Input value={editingOrder?.ShippingTerms} onChange={e => setEditingOrder({ ...editingOrder, ShippingTerms: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="RNC">
                        <Input value={editingOrder?.RNC} onChange={e => setEditingOrder({ ...editingOrder, RNC: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Notify">
                        <Input value={editingOrder?.notify} onChange={e => setEditingOrder({ ...editingOrder, notify: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Container Number">
                        <Input value={editingOrder?.containerNumber} onChange={e => setEditingOrder({ ...editingOrder, containerNumber: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Comments">
                        <Input value={editingOrder?.comments} onChange={e => setEditingOrder({ ...editingOrder, comments: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipment Total Containers">
                        <Input value={editingOrder?.shipmentTotalContainers} onChange={e => setEditingOrder({ ...editingOrder, shipmentTotalContainers: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total Boxes">
                        <Input value={editingOrder?.totalBoxes} onChange={e => setEditingOrder({ ...editingOrder, totalBoxes: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Net Weight">
                        <Input value={editingOrder?.netWeight} onChange={e => setEditingOrder({ ...editingOrder, netWeight: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Gross Weight">
                        <Input value={editingOrder?.grossWeight} onChange={e => setEditingOrder({ ...editingOrder, grossWeight: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Discount">
                        <Input value={editingOrder?.discount} onChange={e => setEditingOrder({ ...editingOrder, discount: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total">
                        <Input value={editingOrder?.total} onChange={e => setEditingOrder({ ...editingOrder, total: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Total Meters">
                        <Input value={editingOrder?.totalMeters} onChange={e => setEditingOrder({ ...editingOrder, totalMeters: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Offer Price">
                        <Input value={editingOrder?.offerPrice} onChange={e => setEditingOrder({ ...editingOrder, offerPrice: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Shipment Fees">
                        <Input value={editingOrder?.ShipmentFees} onChange={e => setEditingOrder({ ...editingOrder, ShipmentFees: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Products">
                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Input
                                                placeholder="Product Name"
                                                value={editingOrder.products[index]?.name || ''}
                                                onChange={(e) => handleEditProductChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Quantity"
                                                value={editingOrder.products[index]?.quantity || ''}
                                                onChange={(e) => handleEditProductChange(index, 'quantity', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Price"
                                                value={editingOrder.products[index]?.price || ''}
                                                onChange={(e) => handleEditProductChange(index, 'price', e.target.value)}
                                            />
                                            <Input
                                                placeholder="length"
                                                value={editingOrder.products[index]?.length || ''}
                                                onChange={(e) => handleEditProductChange(index, 'length', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Height"
                                                value={editingOrder.products[index]?.height || ''}
                                                onChange={(e) => handleEditProductChange(index, 'height', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Weight"
                                                value={editingOrder.products[index]?.weight || ''}
                                                onChange={(e) => handleEditProductChange(index, 'weight', e.target.value)}
                                            />
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Product
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                    <Form.Item label="Boxes">
                        <Form.List name="boxes">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Input
                                                placeholder="Box Name"
                                                value={editingOrder.boxes[index]?.name || ''}
                                                onChange={(e) => handleEditBoxChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Tiles"
                                                value={editingOrder.boxes[index]?.tiles || ''}
                                                onChange={(e) => handleEditBoxChange(index, 'tiles', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Length"
                                                value={editingOrder.boxes[index]?.length || ''}
                                                onChange={(e) => handleEditBoxChange(index, 'length', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Height"
                                                value={editingOrder.boxes[index]?.height || ''}
                                                onChange={(e) => handleEditBoxChange(index, 'height', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Total"
                                                value={editingOrder.boxes[index]?.total || ''}
                                                onChange={(e) => handleEditBoxChange(index, 'total', e.target.value)}
                                            />
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Box
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
            title="Export to pdf"
            open={documentsChoice}
            onCancel={()=>setDocumentsChoice(false)}
            footer={null}
            >   
                <div style={{ marginTop: 25, display: "flex", flexDirection: isMobile ? "column" : "row" , alignItems:"center" , gap: 12 }}>
            <ExportButtonWithSpin exportType="generateInvoice" name="Invoice"/>
            <ExportButtonWithSpin exportType="generateProformaInvoice" name="Proforma Invoice" />
            <ExportButtonWithSpin exportType="generateQuotation" name="Quotation" />
            <ExportButtonWithSpin exportType="generatePackingList" name="Packing List" />
            </div>
        
            </Modal>

            <Modal
    title="Order Details"
    open={orderModal}
    onCancel={() => { viewOrderModal(false); setViewOrder(null); }}
    footer={null}
>
    {viewOrder && (
        <div>
            <p><strong>Status:</strong> {viewOrder.status}</p>
            <p><strong>ID:</strong> {viewOrder._id}</p>
            <p><strong>Customer Name:</strong> {viewOrder.customerName}</p>
            <p><strong>Customer Address:</strong> {viewOrder.customerAddress}</p>
            <p><strong>Customer Phone:</strong> {viewOrder.customerPhone}</p>
            <p><strong>Customer Email:</strong> {viewOrder.customerEmail}</p>
            <p><strong>Customer Tax ID:</strong> {viewOrder.customerTaxId}</p>
            <p><strong>Shipping Type:</strong> {viewOrder.shippingType}</p>
            <p><strong>Shipping Port:</strong> {viewOrder.shippingPort}</p>
            <p><strong>Payment Terms:</strong> {viewOrder.PaymentTerms}</p>
            <p><strong>Shipping Terms:</strong> {viewOrder.ShippingTerms}</p>
            <p><strong>RNC:</strong> {viewOrder.RNC}</p>
            <p><strong>Notify:</strong> {viewOrder.notify}</p>
            <p><strong>Container Number:</strong> {viewOrder.containerNumber}</p>
            <p><strong>Comments:</strong> {viewOrder.comments}</p>
            <p><strong>Shipment Total Containers:</strong> {viewOrder.shipmentTotalContainers}</p>
            <p><strong>Total Boxes:</strong> {viewOrder.totalBoxes}</p>
            <p><strong>Net Weight:</strong> {viewOrder.netWeight}</p>
            <p><strong>Gross Weight:</strong> {viewOrder.grossWeight}</p>
            <p><strong>Discount:</strong> {viewOrder.discount}</p>
            <p><strong>Total:</strong> {viewOrder.total}</p>
            <p><strong>Total Meters:</strong> {viewOrder.totalMeters}</p>
            <p><strong>Offer Price:</strong> {viewOrder.offerPrice}</p>
            <p><strong>Shipment Fees:</strong> {viewOrder.ShipmentFees}</p>
            <p><strong>Products:</strong></p>
<ul>
    {viewOrder.products.map((product, index) => (
        <li key={index}>
            <strong>Name:</strong> {product.name}<br />
            <strong>Quantity:</strong> {product.quantity}<br />
            <strong>Price:</strong> {product.price}<br />
            <strong>length:</strong> {product.length}<br />
            <strong>Height:</strong> {product.height}<br /><br />
        </li>
    ))}
</ul>


<p><strong>Boxes:</strong></p>
<ul>
    {viewOrder.boxes.map((box, index) => (
        <li key={index}>
            <strong>Name:</strong> {box.name}<br />
            <strong>Tiles:</strong> {box.tiles}<br />
            <strong>Length:</strong> {box.length}<br />
            <strong>Height:</strong> {box.height}<br />
            <strong>Total:</strong> {box.total}<br /><br />
        </li>
    ))}
</ul>

            <p><strong>User:</strong></p>
                <ul>
                    <li><strong>Username:</strong> {viewOrder.user.username}</li>
                    <li><strong>Email:</strong> {viewOrder.user.email}</li>
                    <li><strong>Role:</strong> {viewOrder.user.userType}</li>
                    <li><strong>ID:</strong> {viewOrder.user._id}</li>
                </ul>

        </div>
    )}
</Modal>

                

        </div>
    );
};

export default Orders;
