import Comment from "../models/Comments.js"

export const editComment = async (req, res)=>{
    try{
        const commentId = req.params.commentId;
        const existingComment = await Comment.findById(commentId);
        if(existingComment.userId.toString() !== req.user.userId)
        {
            return res.status(400).json({
                message: "User Not Authenticated!"
            })
        }
        const updatedComment = await Comment.findByIdAndUpdate(commentId, {$set:{content: req.body.content}}, {new: true});
        if(!updatedComment)
        {
            return res.status(400).json({message: "The comment doesnt exist!"});
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
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if(!deleteComment)
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