import Comment from "../models/Comments.js"

export const editComment = async (req, res)=>{
    try{
        const commentId = req.params.commentId;
        const existingComment = await Comment.findById(commentId);
        if(!existingComment)
        {
            return res.status(403).json({message: "The comment doesnt exist!"});
        }
        if(!existingComment.userId.equals(req.user.userId))      // used equals instead of == and converting id to string
        {
            return res.status(401).json({
                message: "User Not Authenticated!"
            })
        }
        const updatedComment = await Comment.findByIdAndUpdate(commentId, {$set:{content: req.body.content}}, {new: true});
        if(!updatedComment)
        {
            return res.status(404).json({message: "The comment doesnt exist!"});
        }
        res.status(200).json(updatedComment);
    }catch(err)
    {
        res.status(400).json({message: err.message});
    }
}

export const deleteComment = async (req, res) =>{ 
    try{
        const commentId = req.params.commentId
        const existingComment = await Comment.findById(commentId);
        if(!existingComment)
        {
            return res.status(403).json({message: "The comment doesn't exist!"});
        }
        if(existingComment.userId.toString() !== req.user.userId)
        {
            return res.status(401).json({
                message: "User Not Authenticated!"
            })
        }
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if(!deletedComment)
        {
            return res.status(400).json({message: "Comment not found!"})
        }
        res.status(200).json({
            message: "Comment deleted successfully!"
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}