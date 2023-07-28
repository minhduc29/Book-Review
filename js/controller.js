import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, getDoc, orderBy, onSnapshot, Timestamp, limit, startAt, endAt} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./index.js";
import { view } from "./view.js";
import { component } from "./component.js";
import { book } from "./bookfinder.js";

export const controller = {};

<<<<<<< Updated upstream
//Auth check 
controller.Authentication = async () => {
    auth.onAuthStateChanged(()=>{
        if(auth.currentUser===null){
            document.getElementById('user-auth').innerHTML=component.Authentication(false);
            document.getElementById('review-btn-li').style.display = 'none';
            document.getElementById('login').addEventListener('submit', (e) => {
=======
auth

controller.authChecktotal = () => {
    auth.onAuthStateChanged(()=>{
        if(auth.currentUser===null){
            document.getElementById('user-auth').innerHTML=component.navbarLoginForm();
            const loginForm = document.getElementById('login');
            loginForm.addEventListener('submit', (e) => {
>>>>>>> Stashed changes
                e.preventDefault();
                controller.login();
                document.getElementById('login').reset(); 
            });   

            view.setScreenButton('register','registerScreen');
            // document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));
            // document.getElementById('review-btn-li').style.display = "none";
        
        } else {
            document.getElementById('user-auth').innerHTML=component.Authentication(true);
            document.getElementById('review-btn-li').style.display = 'block';
            document.getElementById('log-out').addEventListener('click',()=>{
                controller.logout();
            });
        }
    })
}

<<<<<<< Updated upstream
//Auth check for comment
controller.showSubmitComment = () => {
    auth.onAuthStateChanged(()=>{
        if (auth.currentUser!==null && view.currentScreen==='reviewDetailScreen') {
            console.log(document.getElementById("comment"));
            document.getElementById("comment").innerHTML = `
            <form class="mb-4 d-flex" id="comment" >
                <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!">
                </input>
                <button class="btn btn-block btn-lg btn-primary">
                    Submit
                </button>
            </form>`;
        } else if (auth.currentUser===null && view.currentScreen==='reviewDetailScreen'){
            console.log(document.getElementById("comment"));
            document.getElementById("comment").innerHTML = ``;
        }
    });
}
=======
// controller.authCheckcommment = () =>{
//     auth.onAuthStateChanged(() => {
//         if (auth.currentUser!==null) {
//         document.getElementById("comment").innerHTML = `<form class="mb-4 d-flex" id="comment" >
//         <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!">
//         </input>
//         <button class="btn btn-block btn-lg btn-primary">
//             Submit
//         </button>
//     </form>`;
//     }
//     else {
//         document.getElementById("comment").innerHTML = ``;
//     }
//     });
// }


>>>>>>> Stashed changes

//Login
controller.login = async () =>{
    //Get user information and create a user data object
    const initialData = {
        email: document.getElementById('email-login').value.trim(),
        password: document.getElementById('password-login').value.trim(),
    }
    
    await signInWithEmailAndPassword(auth, initialData.email, initialData.password).then(user => {
        console.log(`User ${user.user.displayName} successfully logged in`);
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}

//Logout
controller.logout = async () =>{
    await signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    console.log(error.message);
    });
}

//Register
controller.register = async () =>{
    //Get user infor and create data object 
    const initialData = {
        user_name: document.getElementById('username').value.trim(),
        user_email: document.getElementById('email').value.trim(),
        user_password: document.getElementById('password').value.trim(),
        user_authority: 1,                       
    }

    if (initialData.user_name.trim() === '') {
        //Kiểm tra khoảng trống username
        console.log('Missing username');
    } else if (initialData.user_name.trim().length < 6) {
        //Kiểm tra độ dài username
        console.log('Username must be at least 6 characters')
    } else if (initialData.user_password !== document.getElementById('pwconfirmation').value) {
        //Xác nhận mật khẩu
        console.log('Password and password confirmation must be the same')
    } else if (initialData.user_password === document.getElementById('pwconfirmation').value) {
        let exist = false;
        const q = await query(collection(db, 'users'), where('username', '==', initialData.user_name.trim()));
        await getDocs(q).then( async (d) => {
            d.forEach(data => {
                if (data.exists) {
                    exist = true;  
                }
            })
            if (!exist) {
                await createUserWithEmailAndPassword(auth, initialData.user_email, initialData.user_password).then(cred => {
                    // Create data firestore
                    const docRef = doc(db, 'User', cred.user.uid)
                    setDoc(docRef, initialData, { merge: false })
                    console.log(`User ${initialData.user_name} successfully registered`)
                    updateProfile(auth.currentUser, {displayName: initialData.user_name,})
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            } else {
                console.log("This username has already been taken")
            }
        })
    }
}

<<<<<<< Updated upstream
=======
//Thêm comment vào firestore
controller.addComment = async (review_id) =>{
    //Create data object     
    const initialData = {
        comment_creator_id: auth.currentUser.uid,
        comment_created_date: Timestamp.now(),
        comment_review_id: review_id,
        comment_parent_id: null,
        comment_content: document.getElementById('comment-content').value.trim(),
    };

    return await addDoc(collection(db, 'Comment'),initialData);
}

controller.getCurrentReviewDoc = async (review_id) => {

    const docRef = doc(db, "Review", review_id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}


//Lấy query của review từ firestore
controller.getCurrentReviewQuery = async () => {
    return await (query(collection(db,'Review'),orderBy('review_created_date'),limit(5)));
}

//Hiển thị review
controller.showReview = async () => {
    onSnapshot(await controller.getCurrentReviewQuery(),(qr)=>{

        //Define Map variable to store <key,value>
        let data = new Map;

        //Define Array variable to store <key>
        let key = new Array;

        //Set mapping and push key
        qr.forEach(doc =>{
            data.set(doc.id,doc.data());
            key.push(doc.id);
        })

        //Add view for doc
        document.getElementById('featured-post').innerHTML = component.blogEntries(data,key);
        console.log(data.get(key[0]).review_created_date)

        //Set redirect button
        document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
            element.style.cursor='pointer';
            element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
        });
        
        },(err)=>{
            console.log(err);
            console.log(err.message);
        }
    );
}
>>>>>>> Stashed changes

//Add review to firestore
controller.addReview = async () =>{   
    //Create data object
    const initialData = {
        review_created_date: Timestamp.now(),
        review_creator_id: auth.currentUser.uid,
        review_title: document.getElementById('Review-title').value.trim(),
        review_content: document.getElementById('Review-content').value.trim(),
        review_book_id: document.getElementById('rv-bid').value
        //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
    }

    if (initialData.review_title === '' || initialData.review_content === '') {
        alert('Title and content must not be blank');
    } else {
        await addDoc(collection(db, 'Review'),initialData).then(() => {

        document.getElementById('review-funcscreen').innerHTML = 
        `
            <div class="card mt-3">
                <div class="card-body">
                    <h5>Your review has been saved!</h5>
                    <p><a>Go to homepage</a> or <a>Make another review</a></p>
                </div>
            </div>
        `
        //Reset form
        }).catch(err => {
            // Catch error
            console.log(err.message)
        })
    }
}

//Get review query from firestore
controller.getCurrentReviewQuery = async (page) => {
    // ,startAt(page*5),endAt((page+1)*5)
    return await (query(collection(db,'Review'),orderBy('review_created_date','desc')));
}

//Show review at Homepage
controller.showCurrentReviewPage = async (page) => {
    onSnapshot(await controller.getCurrentReviewQuery(),(qr)=>{
        console.log(qr);

        if (qr == null){

        } else {
            //Define Map variable to store <key,value>
            let data_map = new Map;

            //Define Array variable to store <key>
            let key = new Array;

            //Set mapping and push key
            qr.forEach(doc =>{
                data_map.set(doc.id,doc.data());
                key.push(doc.id);
            });

            let key_array = new Array;

            for (let i = page*5; i<(page+1)*5;i++){
                key_array.push(key[i]);
            }

            console.log(key_array); 
            
            //Add view for doc
            document.getElementById('featured-post').innerHTML = component.blogEntries(data_map,key_array);

            //Set redirect button
            document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
            });
        }
        
    });
}

controller.showReviewPage = async () =>{
    controller.showCurrentReviewPage(0);
    document.querySelectorAll('.page-item').forEach(item =>{
        item.addEventListener('click',()=>{
            document.querySelectorAll('.page-item').forEach (childitem =>{
                childitem.setAttribute('class','page-item');
            })
            item.setAttribute('class','page-item active');
            controller.showCurrentReviewPage(item.getAttribute('value')-1);
        });
    });
}

// Get review doc from firestore
controller.getCurrentReviewDetailDoc = async (review_id) => {

    const docRef = doc(db, "Review", review_id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

//Show review detail information at current review page
controller.showCurrentReviewDetail = async (review_id) =>{
    document.getElementById('reviewInfo').innerHTML=component.reviewInfo(await controller.getCurrentReviewDetailDoc(review_id));
    document.getElementById('commentSection').innerHTML=component.commentSection(await controller.getCurrentReviewDetailDoc(review_id));
}


// controller.getComment = async (review_id) =>{
//     onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
//         let value = new Array();
//         qr.forEach(doc =>{
//             console.log(doc.data());
//             value.push(doc.data());
//         })
//         console.log(value);
//     })
// }


//Add comment to firestore
controller.addComment = async (review_id) =>{

    //Get comment information and create a comment data object  
    const initialData = {
        comment_creator_id: auth.currentUser.uid,
        comment_created_date: Timestamp.now(),
        comment_review_id: review_id,
        comment_parent_id: null,
        comment_content: document.getElementById('comment-content').value.trim(),
    };

    //Add comment data object to firestore and return a Promise
    await addDoc(collection(db, 'Comment'),initialData).then(() => {
        // Reset form
        document.getElementById('comment').reset();
        console.log(`User ${auth.currentUser.displayName} successfully comment`); 
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}

//Get parent comment query from firestore
controller.getCurrentCommentQuery = async (comment_review_id) => {
    return await (query(collection(db,'Comment'),and(where('comment_review_id','==',comment_review_id),where('comment_parent_id','==',null)),limit(6)));
}

//Show comment information
controller.showParentComment = async (review_id) =>{
    onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
        let str='';
        qr.forEach(doc =>{
            console.log(doc.data());
            str+=component.displayedParentComment(doc);         
        });
        document.getElementById('comment-section').innerHTML=str;
    });
}



//Get book information
controller.getBookToReview = async () => {
    return await book.resolveQuery(document.getElementById('bookSearchinput').value.replace(/\s+/g, ''));
}   

//Show book information
controller.showBook = async () => {
    let bookResult = await controller.getBookToReview();
    document.getElementById('bookSearchList').innerHTML +=
    `<div class="card-body overflow-auto" style="max-height: 300px">
        <div id="bookSearchoutput"></div>
    </div>`;

    document.getElementById('bookSearchoutput').innerHTML=component.bookSearchoutput(bookResult); 
    document.querySelectorAll(".rv-btn").forEach(e=>{
        e.addEventListener("click", (j) => {
            document.getElementById('rv-title').value = bookResult[j.target.id].title;
            document.getElementById('rv-authors').value = bookResult[j.target.id].authors;
            document.getElementById('rv-pd').value = bookResult[j.target.id].publishedDate;
            document.getElementById('rv-thumbnail').src = component.imageCheck(bookResult[j.target.id].imageLinks);
            document.getElementById('rv-bid').value = bookResult[j.target.id].id;;
            document.querySelectorAll('.review-forminput').forEach(e=>{ 
                e.disabled = false;
            })
        })
    });
}


controller.getReviewQuery = async () => {
    return await (query(collection(db, 'Review')));
}


