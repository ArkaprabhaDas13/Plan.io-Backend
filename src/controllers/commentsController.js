import Comment from "../models/Comments.js"

export const editComment = async (req, res)=>{
    try{
        const commentId = req.params.commentId;
        const updatedComment = await Comment.findByIdAndUpdate(commentId, {$set:{content: req.body.content}}, {new: true});
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
        res.status(200).json({
            message: "Comment deleted successfully!"
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}