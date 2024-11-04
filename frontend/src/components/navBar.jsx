import './navBar.css'

function NavBar(){
    return(
        <>
            <nav className='navBar'>
                <div className='navList'>
                    <ul className='routes'>
                        <li className='navElementList'>Home</li>
                        <li className='navElementList'>Customer</li>
                        <li className='navElementList'>Management</li>
                        <li className='navElementList'>Data</li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default NavBar;