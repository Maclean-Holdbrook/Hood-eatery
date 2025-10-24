import { useState, useEffect } from 'react';
import Loading from '../../Components/Loading';
import { FaSearch, FaUserShield, FaUser } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await usersAPI.getAllUsers();
      // setUsers(response.data.data);

      // Mock data for now
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', orders: 5, createdAt: '2025-09-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', orders: 3, createdAt: '2025-09-20' },
        { id: 3, name: 'Admin User', email: 'admin@hoodeatery.com', role: 'admin', orders: 0, createdAt: '2025-01-01' }
      ]);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="admin-page-title">Users Management</h1>
      <p className="admin-page-subtitle">View and manage registered users</p>

      <div className="admin-search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Total Orders</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-user-cell">
                    {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-customer'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.orders}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
