 document.addEventListener("DOMContentLoaded",function(){

    //whatever we need bring it all here
    const searchButton=document.getElementById("search-button");
    const userNameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");


    //return true or false based on a regex
    function validateUsername(username){
        if(username.trim()===""){
            alert("username should not be empty");
            return false;
        }
        const regex =/^[a-zA-Z0-9_-]{1,15}$/;

        const isMatching=regex.test(username);
        if(!isMatching){
            alert("invalid username");
        }return isMatching;
    }

    async function fetchUserDetails(username){


        try{
            searchButton.textContent="searching...";
            searchButton.disabled=true;
            // statsContainer.style.setProperty("visibility",hidden);
            const proxyUrl='https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://leetcode.com/graphql/';

const myHeaders = new Headers();
myHeaders.append("content-type", "application/json");

const graphql = JSON.stringify({
  query: `
    query userSessionProgress($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `,
  variables: {
    username: `${username}`
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: graphql,
  redirect: "follow"
};

const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("UNABLE to fetch the user details");
            }
            const parseddata = await response.json();
            console.log("Logging data: ",parseddata); 

            displayUserData(parseddata);
        }
        catch(error){
            console.log(error);
            statsContainer.innerHTML=`<p>No data Found</p>`
        }finally{
            searchButton.textContent="search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`
    }

    function displayUserData(parseddata){
        const totalQuestions=parseddata.data.allQuestionsCount[0].count;
        const totalEasyQuestions=parseddata.data.allQuestionsCount[1].count;
        const totalMediumQuestions=parseddata.data.allQuestionsCount[2].count;
        const totalHardQuestions=parseddata.data.allQuestionsCount[3].count;

        const solvedTotalQuestions=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQuestions=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQuestions=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQuestions=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQuestions,totalEasyQuestions,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQuestions,totalMediumQuestions,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQuestions,totalHardQuestions,hardLabel,hardProgressCircle);
        
        const cardData=[{label: "Overall Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
    {label: "Easy Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
{label: "Medium Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
{label: "Hard Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}];
            console.log(cardData);
        cardStatsContainer.innerHTML =cardData.map(data=>{
            return `<div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
            </div>`
        }).join("")

    }

    searchButton.addEventListener('click',function(){


        const username=userNameInput.value;
        console.log(username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

    
 })