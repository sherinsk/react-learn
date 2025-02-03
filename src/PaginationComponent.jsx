import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PaginationComponent = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const fetchUsers = async (page) => {
    if (loading || (totalPages && page > totalPages)) return;
    setLoading(true);
    try {
      const response = await axios.get('https://pagination-backend.vercel.app/api/users', {
        params: { page, limit },
      });
      setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchUsers(currentPage + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Users List</h1>
      
      <table className="min-w-full table-auto text-sm text-left text-gray-600 bg-gray-50 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th className="px-6 py-3 border-b">ID</th>
            <th className="px-6 py-3 border-b">First Name</th>
            <th className="px-6 py-3 border-b">Last Name</th>
            <th className="px-6 py-3 border-b">Email</th>
            <th className="px-6 py-3 border-b">Branch</th>
            <th className="px-6 py-3 border-b">Age</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.firstname}</td>
              <td className="px-6 py-4">{user.lastname}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.branch}</td>
              <td className="px-6 py-4">{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div ref={loaderRef} className="text-center my-4">
        {loading && <p>Loading more users...</p>}
      </div>

      <div className="mt-4 text-gray-600">
        <p>{`Total Users: ${totalUsers}`}</p>
      </div>
    </div>
  );
};

export default PaginationComponent;

// // PaginationComponent.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PaginationComponent = () => {
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [limit, setLimit] = useState(10); // Set the limit per page

//   // Function to fetch users based on the page number
//   const fetchUsers = async (page) => {
//     try {
//       const response = await axios.get('https://pagination-backend.vercel.app/api/users', {
//         params: {
//           page: page,
//           limit: limit,
//         },
//       });

//       setUsers(response.data.users);
//       setCurrentPage(response.data.currentPage);
//       setTotalPages(response.data.totalPages);
//       setTotalUsers(response.data.totalUsers);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Fetch the initial page of users
//   useEffect(() => {
//     fetchUsers(currentPage);
//   }, [currentPage, limit]);

//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return; // Don't allow invalid page numbers
//     setCurrentPage(page);
//   };

//   // Handle page size change
//   const handleLimitChange = (event) => {
//     setLimit(Number(event.target.value));
//     setCurrentPage(1); // Reset to page 1 on page size change
//   };

//   return (
//     <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-semibold mb-6 text-gray-700">Users List</h1>

//       {/* Table of users */}
//       <table className="min-w-full table-auto text-sm text-left text-gray-600 bg-gray-50 rounded-lg overflow-hidden shadow-md">
//         <thead>
//           <tr className="bg-gray-200 text-gray-800">
//             <th className="px-6 py-3 border-b">ID</th>
//             <th className="px-6 py-3 border-b">First Name</th>
//             <th className="px-6 py-3 border-b">Last Name</th>
//             <th className="px-6 py-3 border-b">Email</th>
//             <th className="px-6 py-3 border-b">Branch</th>
//             <th className="px-6 py-3 border-b">Age</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id} className="border-b hover:bg-gray-100">
//               <td className="px-6 py-4">{user.id}</td>
//               <td className="px-6 py-4">{user.firstname}</td>
//               <td className="px-6 py-4">{user.lastname}</td>
//               <td className="px-6 py-4">{user.email}</td>
//               <td className="px-6 py-4">{user.branch}</td>
//               <td className="px-6 py-4">{user.age}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-6">
//         <div className="flex items-center space-x-2">
//           <label htmlFor="limit" className="text-gray-700">Items per page:</label>
//           <select
//             id="limit"
//             value={limit}
//             onChange={handleLimitChange}
//             className="p-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {[10, 20, 30, 50].map((value) => (
//               <option key={value} value={value}>
//                 {value}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Previous
//           </button>
//           <span className="text-gray-600">{`Page ${currentPage} of ${totalPages}`}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       <div className="mt-4 text-gray-600">
//         <p>{`Total Users: ${totalUsers}`}</p>
//       </div>
//     </div>
//   );
// };

// export default PaginationComponent;
