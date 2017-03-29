import qiniu from 'qiniu.js';
import crypto from 'crypto-browserify';

const pxBucket=qiniu.bucket('pxgallary',{
	url:(qiniuBucketUrl?qiniuBucketUrl:`${location.protocol}//${location.host}`)
});

function getKeys(password){

}

pxBucket.feychPutToken=function(password,key=null, returnBody = null){
	return
}

function safyEncode(str){

}

function encodeSign(str, key){
	return crypto.createHmac
}