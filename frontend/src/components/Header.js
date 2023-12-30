import { useState } from 'react';
import { Navbar, Nav, NavDropdown, Badge, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo2.png';

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [searchBox, setSearchBox] = useState(false);

  let userName = userInfo?.name;
  if (userName?.length > 9 && userInfo?.isAdmin) {
    userName = `${userName?.substring(0, 7)}...`;
  } else {
    userName = `${userName?.substring(0, 17)}...`;
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  const searchBoxHandler = () => {
    setSearchBox((prevState) => !prevState);
  };

  return (
    <header className="nav-header">
      <Navbar variant="dark" expand="md" collapseOnSelect>
        <Container >
          <LinkContainer to="/" onClick={setSearchBox.bind(null, false)}>
            <Navbar.Brand>
              <img src={logo} alt="eCommerce" style={{ width: '3.5rem' }} />
              <span className="brand-text">Commerce</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar=-nav">
            <Nav className="ms-auto">
              {searchBox ? (
                <SearchBox onSetSearchBox={searchBoxHandler} />
              ) : (
                <Nav.Link onClick={searchBoxHandler}>
                  <FaSearch />
                </Nav.Link>
              )}
              
              {userInfo ? (
                <NavDropdown
                  title={<FaUser />}
                  id="username"
                  onClick={setSearchBox.bind(null, false)}
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer
                  to="/login"
                  onClick={setSearchBox.bind(null, false)}
                >
                  <Nav.Link>
                    <FaUser />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={<IoSettingsSharp />}
                  id="adminmenu"
                  onClick={setSearchBox.bind(null, false)}
                >
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              <LinkContainer
                to="/cart"
                onClick={setSearchBox.bind(null, false)}
              >
                <Nav.Link>
                  <FaShoppingCart />
                  {cartItems.length > 0 ? (
                    <Badge pill style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  ) : (
                    <Badge pill style={{ marginLeft: '5px' }}>
                      0
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
