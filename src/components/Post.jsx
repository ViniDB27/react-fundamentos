/* eslint-disable react/prop-types */
import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'

export function Post({ author, content, publishedAt }) {
  const [comments, setComments] = useState(['Post muito bacana, hein?!'])
  const [newCommentText, setNewCommentText] = useState('')
  const isNewCommentEmpty = newCommentText.length === 0

  const publishedDateFormated = format(
    publishedAt,
    "d 'de' LLLL 'ás' HH:mm'h'",
    ptBR
  )

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  })

  const formatContent = (line) => {
    switch (line.type) {
      case 'link':
        return (
          <p key={line.content}>
            <a href="#">{line.content}</a>
          </p>
        )
      default:
        return <p key={line.content}>{line.content}</p>
    }
  }

  const handlerCreateNewComment = () => {
    event.preventDefault()
    setComments([...comments, newCommentText])
    setNewCommentText('')
  }

  const handleNewCommentChange = () => {
    event.target.setCustomValidity('')
    setNewCommentText(event.target.value)
  }

  const handlerNewCommentInvalid = () => {
    event.target.setCustomValidity('Esse campo é obrigatorio')
  }

  const deleteComment = (commentTodelete) => {
    const commentsWithoutDeltedOne = comments.filter(
      (comment) => comment !== commentTodelete
    )
    setComments(commentsWithoutDeltedOne)
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time
          title={publishedDateFormated}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>{content.map(formatContent)}</div>

      <form className={styles.commentForm} onSubmit={handlerCreateNewComment}>
        <strong>Deixe seu feedback</strong>
        <textarea
          placeholder="Deixe um comentario"
          name="comment"
          onChange={handleNewCommentChange}
          value={newCommentText}
          onInvalid={handlerNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment
            key={comment}
            content={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </div>
    </article>
  )
}
