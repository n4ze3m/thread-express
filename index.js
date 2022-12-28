const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const allPosts = await prisma.post.findMany({
        where: {
            parent_id: null
        }
    })
    res.json(allPosts);
});

app.get("/post/:id", async (req, res) => {
    const post = await prisma.post.findFirst({
        where: {
            id: req.params.id
        },
        include: {
            children: {
                include: {
                    children: {
                        include: {
                            children: true
                        }
                    }
                }
            }
        }
    })
    res.json(post);
});


app.post("/post", async (req, res) => {
    const { name, text, parent_id } = req.body;

    if (!(name && text)) return res.status(400).json({ error: "Name and text are required" });


    // this means this is a comment
    if (parent_id) {
        const newComment = await prisma.post.create({
            data: {
                name,
                text,
                parent_id
            }
        })
        res.json(newComment);
    } else {
        const newPost = await prisma.post.create({
            data: {
                name,
                text
            }
        })
        res.json(newPost);
    }

});


app.listen(3000, () => {
    console.log('Server is up on port 3000');
});