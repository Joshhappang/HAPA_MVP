/* =========================
   HAPA CANVAS ENGINE
========================= */

export const CanvasEngine = {

    state: [],

    addNode(node){

        this.state.push(node);
    },

    updateNode(id, data){

        const node =
            this.state.find(n => n.id === id);

        if(node){
            Object.assign(node, data);
        }
    },

    deleteNode(id){

        this.state =
            this.state.filter(n => n.id !== id);
    },

    getState(){

        return this.state;
    },

    clear(){

        this.state = [];
    }
};
