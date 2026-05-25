export async function generateNodes(prompt){

    // simulasi AI dulu (nanti bisa diganti backend AI)
    if(prompt.includes("login")){

        return [
            {
                type:"text",
                text:"Email",
                x:100,
                y:100
            },
            {
                type:"text",
                text:"Password",
                x:100,
                y:200
            },
            {
                type:"rect",
                text:"Login Button",
                x:100,
                y:300
            }
        ];
    }

    if(prompt.includes("dashboard")){

        return [
            {
                type:"rect",
                text:"Sidebar",
                x:50,
                y:50
            },
            {
                type:"rect",
                text:"Chart",
                x:250,
                y:100
            }
        ];
    }

    // default
    return [
        {
            type:"text",
            text:"AI Node",
            x:100,
            y:100
        }
    ];
}
