import React, {useState} from 'react';

import {closeWindow, isWindowMaximized, maxUnMaxWindow, minimizeWindow,} from '../../functions/menu-functions';
import styled from 'styled-components';
import isElectron from 'is-electron';
import Color from '../../assets/javascripts/color';

const Wrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 100vw;
height: 30px;
background: ${Color.THEME1};
position: fixed;
z-index: 3;
color: #FFFFFF;
-webkit-app-region: drag;

div {
height: 100%;
}
`;

const Button = styled.button`
height: 100%;
padding: 0 15px;
border: none;
background: transparent;
outline: none;
-webkit-app-region: no-drag;
color: white;

:hover {
background: rgba(0, 0, 0, 0.1);
}
`;

const CloseButton = styled(Button)`
:hover {
    background: rgb(255, 0, 0);
}
`;

const remote = window.require('electron').remote;
const appWindow = remote.getCurrentWindow();

const MenuBar = () => {
    const [isMaximum, setMaximum] = useState(false);

    appWindow.once('maximize', () => {
        setMaximum(isWindowMaximized());
    });
    appWindow.once('unmaximize', () => {
        setMaximum(isWindowMaximized());
    });

    if (!isElectron()) return null;
    return (
        <Wrapper className={'menu-bar'}>
            <div>
                <Button>
                    <i className={'fas fa-bars'}/>
                </Button>
                <span>
                    <b>Kiwi Talk</b>
                </span>
            </div>
            <div>
                <Button onClick={() => minimizeWindow()}>
                    <i className={'fas fa-window-minimize'}/>
                </Button>
                <Button onClick={() => {
                    maxUnMaxWindow();
                }}>
                    <i className={'fas ' + (isMaximum ? 'fa-clone' : 'fa-square')}/>
                </Button>
                <CloseButton onClick={() => closeWindow()}>
                    <i className={'fas fa-times'}/>
                </CloseButton>
            </div>
        </Wrapper>
    )
};

export default MenuBar;