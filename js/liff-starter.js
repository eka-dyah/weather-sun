window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1653696907-dENVDN5P";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}


function initializeApp() {
    getInfoLine();
    btnHandlers();
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {

        liff.getProfile()
            .then(user => {
                document.getElementById('message').innerHTML = `<p>Hai, ${user.displayName}!</p>`
            })
            .catch((err) => {
                console.log('error', err);
            });

        document.getElementById('btn-login').style.display = 'none';

    } else {

        document.getElementById('btn-logout').style.display = 'none';

    }
}

function getInfoLine() {
    if (liff.isInClient()) {
        document.getElementById('openWindowButton').addEventListener('click', function() {
            liff.openWindow({
                url: 'https://wheatersun.herokuapp.com/', 
                external: true
            });
        });
        document.getElementById('closeWindowButton').addEventListener('click', function() {
            liff.closeWindow();
        });
    
    } else {
        document.getElementsByClassName('buttonContent').style.display = 'none'
        document.getElementById('clientOrExternal').innerHTML = `<p>You're running in external browser, open Line App for better experience</p>`
    }

}

function btnHandlers() {

    document.getElementById('btn-login').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
        console.log("clicked");
    });
 
 
    document.getElementById('btn-logout').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
        console.log("clicked also")
    });
 
    document.getElementById('sendMessageButton').addEventListener('click', function() {

        cityName = document.getElementById('cityName').value;
        temp = document.getElementById('temp').value;
        tempFeel = document.getElementById('tempFeel').value;
        humid = document.getElementById('humid').value;
        cloudiness = document.getElementById('cloudiness').value;

        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': `${cityName}\n
                        Temp: ${temp}\n
                        Temp Feel: ${tempFeel}\n
                        Humid: ${humid}\n
                        Clodiness: ${cloudiness}`
            }]).then(function() {
                window.alert('Ini adalah pesan dari fitur Send Message');
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    }); 
}

