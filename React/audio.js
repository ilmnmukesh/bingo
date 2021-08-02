class Sound {
    path = "../static/audio/"
    audio = {
        btnChange: this.path + "stickyImpact.ogg",
        connect: this.path + "dripity.ogg",
        generate: this.path + "shieldUp.ogg",
        error: this.path + "error.ogg",
        back: this.path + "shieldDown.ogg",
        left: this.path + "playerLeft.ogg",
        add: [this.path + "bellHigh.ogg", this.path + "bellLow.ogg"],
        changeName: this.path + "activateBeep.ogg",
        changeColor: this.path + "ding.ogg",
        start: this.path + "boxingBell.ogg",
        score: this.path + "score.ogg"
    }

    play(select) {
        if (this.audio[select] !== undefined) {
            if (select === "add") {
                new Audio(this.audio[select][0]).play()
                setTimeout(() => {
                    new Audio(this.audio[select][1]).play()
                }, 500)
            } else {
                new Audio(this.audio[select]).play()
            }

        }
    }
}