import express from 'express'
import {postLogin} from '../controllers/students'

const router=express.Router()

router.post('/login',postLogin)