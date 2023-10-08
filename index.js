import puppeteer from 'puppeteer';
import express from 'express';

const app = express();

const ip = '192.168.1.251';
const user = 'admin';
const password = '5f$Az3cwaQrDE#K';

app.get('/:portId/:state', async (req, res) => {
    const portId = req.params.portId;
    const state = req.params.state;

    if (portId < 1 || portId > 16 || state < 0 || state > 1) res.send('pas ok');

    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();

    await page.goto('http://'+ip, {
        waitUntil: 'networkidle0'
    });

    await page.type('#username', user);
    await page.type('#password', password);

    const navigationPromise = page.waitForNavigation();
    await page.click('#logon');
    await navigationPromise;

    await page.goto(`http://${ip}/port_setting.cgi?portid=${portId}&state=${state}&speed=1&flowcontrol=0&apply=Apply`, {
        waitUntil: 'networkidle0'
    });

    await browser.close();

    res.send('ok');
});

app.listen(3000, '0.0.0.0', () => {
   console.log('Server started on 0.0.0.0:3000')
});