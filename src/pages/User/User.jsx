import React, { useEffect, useState } from "react"
import useCustomFetch from "../../hooks/useCustomFetch";
const User = () => {

  const [listUser, setListUser] = useState([])

  const [getListUser] = useCustomFetch();


  useEffect(() => {
    const fetchUser = async () => {
      const res = await getListUser("/User");
      setListUser(res.data);
    };
    fetchUser();
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>User Id</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role Name</th>
          </tr>
        </thead>
        <tbody>
          {listUser?.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.roleName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default User;
