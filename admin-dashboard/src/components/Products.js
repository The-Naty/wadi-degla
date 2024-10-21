import React, { useState, useEffect } from 'react';
import {Table , Button , Modal , Input} from 'antd'
import { EditOutlined , DeleteOutlined , EyeOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

import { render } from '@testing-library/react';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [addForm, viewAddForm] = useState(false);
    const [editForm, viewEditForm] = useState(false);    
    const [productModal, viewProductModal] = useState(false);
    const [viewProduct, setViewProduct] = useState(null);
    const [editingProduct , setEditingProduct] = useState(null);
    const [newProduct , setNewProduct] = useState({name:"" , description:"" , image:""});
    
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const fetchProtectedData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/product/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                console.error('Failed to fetch products:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const addProduct = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/product/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newProduct.name,
                    description:newProduct.description,
                    image: newProduct.image,
                })
                
            });
            if (response.ok) {
                fetchProtectedData();
            } else {
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const editProduct = async() => {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/product/update/${editingProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editingProduct.name,
                    description:editingProduct.description,
                    image: editingProduct.image,
                })
                
            });
            if (response.ok) {
                fetchProtectedData();
            } else {
            }
        } catch (error) {
            console.error('Error:', error);
        }


    }

    const deleteProduct = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/product/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    
                })
                
            });

            if (response.ok) {
                fetchProtectedData();
            } else {
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchProtectedData();

    }, []);


    const onAdd = () => {

       viewAddForm(true)


    } 

    const onDelete = (product) => {

        Modal.confirm({
            title:"Are you sure, you want to delete this product ?",
            onOk:()=>{

                deleteProduct(product._id);

                
            },
            okText:"Yes",
            okType:"danger"
           
        })


    }


    const onEdit = (product) => {

        viewEditForm(true);
        setEditingProduct({...product});
        


    }

    const onView = async (product) => {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://wadidegla-q264.onrender.com/api/product/find/${product.name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
              
            });
            const data = await response.json();
            if (response.ok) {
                setViewProduct(data);
                viewProductModal(true);
            } else {
                console.error('Failed to fetch product details:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const columns = [
        {   key:1,
            title:"ID",
            dataIndex:"_id",
            render: (text) => text.substring(0, 5),
            sorter:(record1,record2)=>{
                return record1._id > record2._id
            },
            
        },
        {   key:2,
            title:"Name",
            dataIndex:"name",
            sorter:(record1,record2)=>{
                return record1.name > record2.name
            }
        },
        {   key:3,
            title:"Description",
            dataIndex:"description",
            sorter:(record1,record2)=>{
                return record1.email > record2.email
            }
        },
        {   key:4,
            title:"Image",
            dataIndex:"image",
            render: (text, record) => <img src={record.image} alt={record.name} style={{ width: 100 }} />,

            
        },
        {   key:5,
            title:"Actions",
            render : (record)=>{

                return <>
                    <EyeOutlined onClick={() => onView(record)} style={{color:"blue", cursor: "pointer" }} />
                    <EditOutlined onClick={()=>{
                        onEdit(record)
                    }} style={{ cursor:"pointer" , marginLeft:12}} />
                    <DeleteOutlined onClick={()=>{
                        onDelete(record);
                    }} style={{color:"red" , marginLeft:12 , cursor:"pointer"}}/>
                </>

            }
        },
    ];

    


    return (
        <div style={{width:"100%"}} >
        <title>Products - Wadi Degla</title>

            {isMobile ? (
            <div>
                {products.map(product => (
                    <div key={product._id} style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: 16, marginBottom: 16 }}>
                        <p><strong>ID:</strong> {product._id.substring(0, 5)}</p>
                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                        <img src={product.image} alt={product.name} style={{ width: 100 }} />
                        <div style={{marginTop:15}}>
                            <EyeOutlined onClick={() => onView(product)} style={{ color: 'blue', cursor: 'pointer' }} />
                            <EditOutlined onClick={() => onEdit(product)} style={{ cursor: 'pointer', marginLeft: 12 }} />
                            <DeleteOutlined onClick={() => onDelete(product)} style={{ color: 'red', marginLeft: 12, cursor: 'pointer' }} />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <Table
                columns={columns}
                dataSource={products}
                pagination={{ pageSize: 10 }}
            />
        )}
            <Button onClick={onAdd}  style={{marginBottom:"0" }}>Add new product</Button>


            <Modal
                title="Add product"
                open={addForm}
                onCancel={()=>{viewAddForm(false)}}
                onOk={()=>{
                    
                    addProduct();    
                    viewAddForm(false)
                    setNewProduct(null);

                    
                    }}
                okText="Add"    
            >
                
                <Input onChange={(e)=>{
                    setNewProduct((pre)=>{

                        return {...pre , name:e.target.value}

                    })
                }} value={newProduct?.name} style={{marginTop:25}} allowClear addonBefore='Name'/>
                <Input onChange={(e)=>{
                    setNewProduct((pre)=>{

                        return {...pre , description:e.target.value}

                    })
                }} value={newProduct?.description} style={{marginTop:20}} allowClear addonBefore='Description'/>

                <Input onChange={(e)=>{
                    setNewProduct((pre)=>{

                        return {...pre , image:e.target.value}

                    })
                }} value={newProduct?.image} style={{marginTop:20}} allowClear addonBefore='Image'/>    

               
            
            </Modal>

            <Modal
                title="Edit product"
                open={editForm}
                onCancel={()=>{viewEditForm(false)}}
                onOk={()=>{
                    
                    editProduct();    
                    viewEditForm(false)}
                    
                }
                okText="Save"    
            >
                <Input onChange={(e)=>{
                    setEditingProduct((pre)=>{

                        return {...pre , name:e.target.value}

                    })
                }} value={editingProduct?.name} style={{marginTop:25}} allowClear addonBefore='Name'/>
                <Input onChange={(e)=>{
                    setEditingProduct((pre)=>{

                        return {...pre , description:e.target.value}

                    })
                }} value={editingProduct?.description} style={{marginTop:20}} allowClear addonBefore='Description'/>
                <Input onChange={(e)=>{
                    setEditingProduct((pre)=>{

                        return {...pre , image:e.target.value}

                    })
                }} value={editingProduct?.image} style={{marginTop:20}} allowClear addonBefore='Image'/>   

            </Modal>

            <Modal
                title="Product Details"
                open={productModal}
                onCancel={() => { viewProductModal(false); setViewProduct(null); }}
                footer={null}
            >
                {viewProduct && (
                    <div>
                        <p style={{marginTop:20}}><strong>Name:</strong> {viewProduct.name}</p>
                        <p><strong>Description:</strong> {viewProduct.description}</p>
                        <img width={100} src={viewProduct.image}/>
                        
                    </div>
                )}
            </Modal>


        </div>
    );
};

export default Products;
