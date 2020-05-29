import React from 'react';
import {AppBar, Toolbar} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import PurchaseButton from 'app/fuse-layouts/shared-components/PurchaseButton';
import PoweredByLinks from 'app/fuse-layouts/shared-components/PoweredByLinks';
import {useSelector} from 'react-redux';

function FooterLayout2(props)
{
    const footerTheme = useSelector(({fuse}) => fuse.settings.footerTheme);

    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar id="fuse-footer" className="relative z-10" color="default" style={{backgroundColor: footerTheme.palette.background.default}}>
                <Toolbar className="px-16 py-0 flex items-center">
                    <div class="field field--name-body field--type-text-with-summary field--label-hidden field--item"><p><a href="http://eocr.virginia.edu/notice-non-discrimination-and-equal-opportunity">Notice of Non-Discrimination and Equal Opportunity</a> | <a href="http://reportabarrier.virginia.edu">Report a Barrier</a> | <a href="http://www.virginia.edu/siteinfo/privacy/">Privacy Policy</a></p>

                        <div class="notice">
                        <p>© 2020 By the Rector and Visitors of the University of Virginia</p>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default FooterLayout2;
