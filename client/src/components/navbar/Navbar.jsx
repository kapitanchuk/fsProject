import React,{useEffect} from 'react'
import { Link,useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { HidePopup, SetOptionsMenuVisibility, SetSiderbarVisibility, ShowPopup } from '../../reducers/UIreducer';
import AccountPopUp from '../account/AccountPopUp.jsx';
import { ReactComponent as  UserProfileIcon} from '../../icons/User-Profile-Icon.svg';
import {CSSTransition} from 'react-transition-group'
import './Navbar.scss'

const Navbar = () => {
    
    const showpopup = useSelector(state=>state.UI.showpopup)
    const isAuth = useSelector(state => state.user.isAuth)

    const options_menu = useSelector(state=>state.UI.options_menu)
    const show_sidebar = useSelector(state=>state.UI.show_sidebar)
    const matchFamiliesList = useMatch("/")
    const dispatch = useDispatch()

    
    
    useEffect(() => {
        // add listener only once, or many listeners would be created every render
        const mq = window.matchMedia("(max-width: 780px)");
        if(mq.matches)dispatch(SetOptionsMenuVisibility(true));
        
        mq.addListener((res) => {
            
        // new Promise((resolve)=>{
            dispatch(SetOptionsMenuVisibility(res.matches))
            
            // console.log("show sidebar ",show_sidebar)
        //     resolve()
        // }).then(()=>{
        //     if(!res.ma)
        // })
          
        });
        return () => mq.removeListener();
    }, []);
      

    if(!options_menu&&show_sidebar){
        dispatch(SetSiderbarVisibility(!show_sidebar))
    }
    // const dimensions = useWindowDimensions()
    // if(dimensions.width<=780){
    //     dispatch(SetOptionsMenuVisibility(true))
        
    // }
    // else{
        
    //     dispatch(SetOptionsMenuVisibility(false))
    //     if(show_sidebar){
    //         dispatch(SetSiderbarVisibility())
    //     }
    // }

    return (
        <div className="navbar">
            <div className="container">

                
                {/* <Link to="/"><div className="navbar__logo navbar__logo_pc">Axioma Sprachbörse</div></Link>
                <Link to="/"><div className="navbar__logo navbar__logo_mobile">Axioma</div></Link> */}
                
                {isAuth && matchFamiliesList && options_menu&& <div onClick={()=>{dispatch(SetSiderbarVisibility(!show_sidebar));if(showpopup)dispatch(HidePopup())}} className={
                    `navbar__optionsMenu ${show_sidebar?'sidebar_opened':'sidebar_closed'}`}><div className="navbar__optionsMenu_btn"></div></div>
                }
                <div className="navbar__logo navbar__logo_pc"><Link to="/"> Axioma Sprachbörse</Link></div>
                <div className="navbar__logo navbar__logo_mobile"><Link to="/"> Axioma</Link></div>
                {/* <Link to="/"><div className="navbar__logo navbar__logo_pc"></div></Link> */}
                

                <div className="navbar__links">
                    {!isAuth && <div className="navbar__authorisation"><Link to="/authorisation">Sign in</Link></div>}
                    {!isAuth && <div className="navbar__registration"><Link to="/registration">Sign up</Link></div>}
                    {isAuth && <div className="navbar__account" onClick={()=>{
                        dispatch(ShowPopup())
                        if(show_sidebar)dispatch(SetSiderbarVisibility(!show_sidebar))
                        }
                    }>
                        <UserProfileIcon/></div>}
                    <CSSTransition
                        in={showpopup}
                        timeout={500}
                        classNames={"account_popup"}
                        unmountOnExit
                    >
                        <AccountPopUp/>
                    </CSSTransition>
                    
                    <CSSTransition
                        in={showpopup}
                        timeout={500}
                        classNames={"profile-popup__outer"}
                        unmountOnExit
                    >
                        <div onClick={()=>{dispatch(HidePopup())}} className='profile-popup__outer'></div>
                    </CSSTransition>
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar
