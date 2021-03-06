/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var currentReview;

var _helpers = _helpers || {};
_helpers.genId = function () {
  id = Math.floor((Math.random() * 99999999) + 1);
    
  return id;  
};
_helpers.isNullorEmpty = function (object) {
    if (!object || object == "") {
        return true;
    } else {
        return false;
    }
};



var _rating = _rating || {};
_rating.container = document.getElementsByClassName('ratings');
_rating.starAmount = 5;
_rating.emptyIcon = ";&2606";
_rating.fillIcon = ";&2605";
_rating.init = function () {
    var starContainer = document.getElementById('add-stars');
    
    // Create the stars
    for (var i = 0; i < _rating.starAmount; i++) {
        var star = document.createElement('SPAN');
        star.classList.add('star');
        
        starContainer.appendChild(star);
        
        star.addEventListener('touchend', function (index) {
            return function () {
                var stars = starContainer.children;
                for (var i = 0; i < stars.length; i++) {
                    stars[i].classList.remove('rated');
                    if (i < index) {
                        stars[i].classList.add('rated');
                    }
                }
                
                starContainer.dataset.rating = index + 1;
            }
        }(i + 1), false);
    }
}
_rating.draw = function (rating, element) {
    var container = element
    for (var i = 0; i < _rating.starAmount; i++) {
        // Create the elements
        var star = document.createElement('SPAN');
        star.classList.add('star-fixed');
        if (rating > i+1) {
            star.classList.add('rated');
        }
        
        container.appendChild(star);
    }
}

var _localStorage = _localStorage || {};
_localStorage.key = "reviewr-bowe0145";
_localStorage.save = function (item) {
    localStorage.setItem(_localStorage.key, JSON.stringify(item));
};
_localStorage.load = function () {
    // Load the JSON from localstorage
    var item = localStorage.getItem(_localStorage.key);
    // Parse the item
    item = JSON.parse(item);
    // Return the item to be used as json
    return item;
};
_localStorage.getById = function (id) {
    var item = null;
    var items = _localStorage.load();
    
    for (var i = 0; i < items.length; i++) {
        if (items[i].id == id) {
            item = items[i];
        }
    }
    
    return item;
}
_localStorage.saveReview = function (item) {
    var items = _localStorage.load();
    
    if (!_helpers.isNullorEmpty(items)) {
        items.reviews.push(item);   
    } else {
        // Create the holder
        var holder = {"reviews": []};
        holder.reviews.push(item);
        
        items = holder;
    }
    
    _localStorage.save(items);
};

var _buttons = _buttons || {};
_buttons.save = function (ev) {
    ev.preventDefault();
    _page.saveReview();
    
    // Clean up
    _buttons.cancel(ev);
    
    _page.home();
};
_buttons.cleanup = function (ev) {
    // Reset form
    ev.preventDefault();
    
    var clickEvt = new CustomEvent('touchend', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    
    // Clean the form
    var item = document.getElementById('add-item').value = "";
    var stars = document.getElementById('add-stars').children[0].dispatchEvent(clickEvt);
    var image = document.getElementById('add-image');
    image.src = "";
    image.classList.add('inactive');
}
_buttons.cancel = function (ev) {
    ev.preventDefault();
    // Create a click event
    var clickEvt = new CustomEvent('touchend', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });

    // Click the xButton
    document.getElementById('add-x').dispatchEvent(clickEvt);
};
_buttons.picture = function (ev) {
    ev.preventDefault();
    var options = {
        quality: 25,
        targetHeight: 300,
        targetWidth: 300,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    };
    navigator.camera.getPicture(function cameraSuccess(data) {
        var image = document.getElementById('add-image');
        console.log(data);
        image.src = data;
        image.dataset.url = data;
        image.classList.remove('inactive');
    }, function cameraError(error) {
        console.debug("error: " + error);
    }, options);
};

var _page = _page || {};
_page.home = function () {
    // Fill the list
    
    var allReviews = _localStorage.load();
    if (!_helpers.isNullorEmpty(allReviews)) {
        allReviews = allReviews.reviews;
        var container = document.querySelector('.home-list');
        container.innerHTML = "";
        for (var i = 0; i < allReviews.length; i++) {
            //.home-list

            var cell = document.createElement('LI');
            cell.classList.add('table-view-cell');
            cell.classList.add('media');
            var link = document.createElement('A');
            link.classList.add('navigate-right');
            var image = document.createElement('IMG');
            image.classList.add('media-object');
            image.classList.add('pull-left');
            image.src = allReviews[i].img;
            var mainBody = document.createElement('DIV');
            mainBody.classList.add('media-body');
            var title = document.createElement('H4');
            var rating = document.createElement('DIV');
            rating.classList.add('star-holder');

            _rating.draw(allReviews[i].rating, rating);
            title.textContent = allReviews[i].name;
            mainBody.appendChild(title);
            mainBody.appendChild(rating);
            mainBody.appendChild(image);
            cell.appendChild(mainBody);
            container.appendChild(cell);
        }
    }
};
_page.saveReview = function () {
    var item = document.getElementById('add-item');
    var rating = document.getElementById('add-stars');
    var picture = document.getElementById('add-image');
    if (!_helpers.isNullorEmpty(item) && !_helpers.isNullorEmpty(rating.dataset.rating) && !_helpers.isNullorEmpty(picture)) {
        // If item and rating aren't empty then continue
        
        var tempItem = {"id": _helpers.genId(), "img": picture.dataset.url, "name": item.value, "rating": rating.dataset.rating};
        _localStorage.saveReview(tempItem);
    }
};

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('add-save').addEventListener("touchend", _buttons.save);
        document.getElementById('add-picture').addEventListener("touchend", _buttons.picture);
        document.getElementById('add-cancel').addEventListener("touchend", _buttons.cancel);
        document.getElementById('add-x').addEventListener("touchend", _buttons.cleanup);
        _rating.init();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        _page.home();
    },
};

app.initialize();
_page.home();