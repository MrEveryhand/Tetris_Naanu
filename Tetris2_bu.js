
var makeEventTrigger = function(name){
    return function(...args){
        var that = this
        ;(this['__'+name] || [])
            .forEach(function(handler){
                handler.call(that, ...args) })
        return this }}
var makeEventBinder = function(name){
    return function(handler){
        this['__'+name] = (this['__'+name] || []).concat([ handler ])
        return this } }


/*
        TetrisPrototype
        .onEnd(..)
        .end(..)
            ^
            |
            | (new Tetris)
            |
        tetris
        .__end
*/

var TetrisPrototype = {
    options: {},

    clear: function(){
        return this },

    showField: function(){ return this },
    showFigure: function(){ return this },

    initUserControl: function(){ return this },

    // events...
    start: makeEventTrigger('start'),
    onStart: makeEventBinder('start'),
    tick: makeEventTrigger('tick'),
    onTick: makeEventBinder('tick'),
    end: makeEventTrigger('end'),
    onEnd: makeEventBinder('end'),
    figureDrop: makeEventTrigger('figureDrop'),
    onFugureDropped: makeEventBinder('figureDrop'),
    figureDrop: makeEventTrigger('figureDrop'),
    onFugureDropped: makeEventBinder('figureDrop'),
    figureMove: makeEventTrigger('figureMove'),
    onFugureMoved: makeEventBinder('figureMove'),


    figures: ['i', 'l', 'j', 'o', 's', 'z'],
    figure_position: null,
    figure_type: null,
    figureCanShow: function(){
        // XXX get filed state...
        return true }, 
    figureShow: function(type){
        type = this.figure_type = 
            (type == 'random' || type === undefined) ?
                this.figures[Math.floor(Math.random() * this.figures.length)]
                : type
        this.figure_position = this.figure_position == null ? 
            0
            : this.figure_position
        console.log(`Figure ${type} @ ${this.figure_position}`)
        return this },
    figureCanMove: function(){
        return this.figure_position >= this.options.field_size },
    figureMove: function(){
        this.figure_position += 1
        this.figureShow()
        return this },


    startDebug: function(){
        var that = this
        Object.keys(this)
            .filter(function(a){
                return a.startsWith('on') })
            .forEach(function(a){
                that[a](function(...args){
                    console.log(`DEBUG: called: this.${a}(...${ args })`) }) })
        return this },
}
var Tetris = function(options){
    return Object.assign(
        Object.create(TetrisPrototype),
        { options: Object.assign(
            {},
            TetrisPrototype.options, 
            options || {})}) }




var tetris = new Tetris({
    field_size: 20,
    field_width: 10,
    level: 1,
    frame_speed: 200,
})


tetris
    .clear()
    .showField()
    .figureShow('random')
    .initUserControl({
        turn_cw: '',
        turn_ccw: '',
        left: '',
        right: '',
        drop: '',
        pause: '',
        restart: '',
    })
    .onEnd(function(){
        this
            .clear()
            .initUserControl() })
    .onEnd(function(){
        console.log('GAME OVER!') })
    .onFugureDropped(function(){
        this   
            .figureFreeze()
            .clearLines()
        this.figureCanShow() ?
            this.showFigure('random')
            : this.end() })
    .onTick(function(){
        !this.figureCanMove() ?
            this.figureMove()
            : this.figureDropped() 
        setInterval(this.tick, this.options.frame_speed })
    .onStart(function(){
        this.showFigure('random')
        this.tick()
    })
    .start()


