import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/slices/usersSlice.ts';
import UserMenu from './UserMenu.tsx';
import { useEffect } from 'react';

const Toolbar = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container d-flex align-items-center justify-content-between">
        <NavLink className="navbar-brand text-white d-inline-flex align-items-center gap-2" to="/">
          <i className="bi bi-chat-dots fs-1"></i>
          Live Chat
        </NavLink>
        {user &&
          <div className="d-flex justify-content-end gap-3">
            <UserMenu user={user}/>
          </div>
        }
      </div>
    </nav>
  );
};

export default Toolbar;