const textarea  = document.querySelector(".wrapper form textarea")
const speechBtn = document.querySelector(".wrapper button")
const voiceList = document.querySelector(".wrapper select")

let synth = speechSynthesis
let isSpeaking = false

speechBtn.addEventListener('click', e => {
    //form was submitting text inside textarea so it is needed to stop it
    e.preventDefault()
    if(textarea.value !== ""){
        if(!synth.speaking){
            textToSpeech(textarea.value)
        }
        if(textarea.value.length>80){
            if(!isSpeaking){
                synth.resume()
                isSpeaking = true
                speechBtn.innerHTML = 'Pause Speech'
            }
            else{
                synth.pause()
                isSpeaking = false
                speechBtn.innerHTML = 'Resume Speech'
            }

            //checking every 100ms if speech finished
            setInterval(()=>{
                if(!synth.speaking && isSpeaking == false){
                    isSpeaking = true
                    speechBtn.innerHTML = 'Convert To Speech'
                }
            })
        }
        else{
            speechBtn.innerHTML = 'Convert To Speech'
        }
    }
})

const textToSpeech = (text) => {
    let utternance = new SpeechSynthesisUtterance(text) //represents a speech request
    for(let voice of synth.getVoices()){
        if(voice.name == voiceList.value){
            utternance.voice = voice
        }
    }
    synth.speak(utternance) //speak the speech

}

const voices = () => {
    for(let voice of synth.getVoices()){
        //selecting Google US English as default
        let selected = voice.name === 'Google US English' ? 'selected' : ''
        //creating an option tag and passing every voice info
        let option = `<option value="${voice.name}" ${selected}>${voice.name} ${voice.lang}</option>`
        voiceList.insertAdjacentHTML('beforeend', option)
    }
}

synth.addEventListener('voiceschanged', voices)