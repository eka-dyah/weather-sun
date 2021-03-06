window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server
 
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
    getInfoLiff();
    btnHandlers();
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        
        document.getElementById('liffLoginButton').style.display = 'none';

        liff.getProfile()
            .then(user => {
                document.getElementById('message').innerHTML = `Hai, ${user.displayName}!`;
            })
            .catch((err) => {
                console.log('error', err);
            });

    } else {
        document.getElementById('sendMessageButton').style.display = 'none';
        document.getElementById('liffLogoutButton').style.display = 'none';
    }
}

function getInfoLiff() {
    if (liff.isInClient()) {
        liff.getProfile()
            .then(user => {
                document.getElementById('message').innerHTML = `Hai, ${user.displayName}!`;
            })
            .catch((err) => {
                console.log('error', err);
            });
        document.getElementById('buttonContent').style.display = 'inline';
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('clientOrExternal').textContent = 'Welcome to Line in-app browser!';
        
    } else {
        document.getElementById('buttonContent').style.display = 'none';
        document.getElementById('clientOrExternal').textContent = "You're running in external browser, open Line App for better experience";
    }
}

function btnHandlers() {

    document.getElementById('openWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            alert("Fitur ini hanya tersedia jika membuka aplikasi di Line in-app browser");
        } else {
            liff.openWindow({
                url: 'https://weathersun.herokuapp.com/', 
                external: true
            });
        }
    });

    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            alert("Fitur ini hanya tersedia jika membuka aplikasi di Line in-app browser");
        } else {
            liff.closeWindow();
        }
    });

    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
 
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {

        cityName = document.getElementById('cityName').innerHTML;
        temp = document.getElementById('temp').innerHTML;
        tempFeel = document.getElementById('tempFeel').innerHTML;
        windSpeed = document.getElementById('windSpeed').innerHTML;
        humid = document.getElementById('humid').innerHTML;
        cloudiness = document.getElementById('cloudiness').innerHTML;
        msg = cityName + "\n" + "Temp: " + temp + " Celcius\n" + "Temp Feel: " + tempFeel + " Celcius\n" + "Humid: " + humid + "\n" + "Wind Speed: " + windSpeed + "\n" + "Cloudiness: " + cloudiness;

        if (liff.isInClient()) {
            liff.sendMessages([
                {
                  type:'text',
                  text:msg
                }
              ])
              .then(() => {
                alert('Message sent');
              })
              .catch((err) => {
                alert('Error', err);
              });
        } else {
            alert("Fitur ini hanya tersedia jika membuka aplikasi di Line in-app browser");
        }
    });
}

