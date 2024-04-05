import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.css';
import user from './user.png';

function App() {
  const [Emps, setEmps] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/emp/userListe')
      .then((response) => response.json())
      .then((data) => setEmps(data))
      .catch((error) => console.error('Error fetching Emps', error));
  }, []);

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cet employé ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" danger className="delete-button">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    fetch('http://localhost:3001/api/emp/ajouterEmp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Employé ajouté avec succès:', data);
      fetch('http://localhost:3001/api/emp/userListe')
        .then((response) => response.json())
        .then((data) => setEmps(data))
        .catch((error) => console.error('Error fetching Emps', error));
    })
    .catch(error => console.error('Error adding employee:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/emp/deleteEmp/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Employé supprimé avec succès:', data);
      fetch('http://localhost:3001/api/emp/userListe')
        .then((response) => response.json())
        .then((data) => setEmps(data))
        .catch((error) => console.error('Error fetching Emps', error));
    })
    .catch(error => console.error('Error deleting employee:', error));
  };

  return (
    <div className='home'>
      <div className="page-container">
        <div className="navbar">
          <div className="wrapper">
            <div className="titre-menu">
              <span> Liste des Employées</span>
            </div>
            <div className="items">
              <div className="item">
                <img src={user} alt="PlaniPro Logo" className="imageuser" />  
              </div>
              <div className="item">
                <span className='nom_prenom_user'>Welcome</span>
              </div> 
            </div>
          </div>
        </div>
      </div>

      <div className="amplimentation">
        <p className="ajouter-employe">Ajouter un employé</p>
        <div className='form-container'>
          <Input
            placeholder="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <Button type="primary" onClick={handleSubmit}>
            Ajouter Employé
          </Button>
        </div>

        <div className='table_centre' style={{ height: "500px", overflowY: "auto" , marginTop:"20px"}}>
          <Table rowKey={(record) => record._id} columns={columns} dataSource={Emps} />
        </div>
      </div> 
    </div>
  );
}

export default App;
