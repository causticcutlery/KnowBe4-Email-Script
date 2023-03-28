function phishPhinder() 
{
  //Creates Phish label if it doesn't exist, then assigns it to a var
  createPhishLabel();
  var label = GmailApp.getUserLabelByName("Phish");
  
  //Stores unread emails in a var to check if they are phishing emails
  //Alternatively, can be set to always pull the last 10 threads
  var threads = GmailApp.search('is:unread');
  //var threads = GmailApp.getInboxThreads(0, 10);
  
  
  //Iterates through email threads
  for (var i = 0; i < threads.length; i++) 
  {
    //Checks if thread is unread, which is used to speed up execution if last 10 threads are viewed
    if(threads[i].isUnread())
    {
      //Gets the actual emails (messages) from the thread and stores it in a var
      //Some threads contain multiple messages
      var messages = threads[i].getMessages();

      for (var j = 0; j < messages.length; j++) 
      {
        //The raw content of a message contains email headers
        var body = messages[j].getRawContent();

        //Checks email headers to see if they contain key phishing phrases
        //Adds the phishing label to the thread if the phrases are found
        if(isPhish(body))
          label.addToThread(threads[i]);
      }       
    }
  }
}

function createPhishLabel() 
{
  //Name of label to create
  var phishLabel = "Phish"

  //Creates a label if it does not exist
  if(!doesLabelExist(phishLabel))
    GmailApp.createLabel(phishLabel)
}

function doesLabelExist(labelToCheck)
{
  //Stores current user's labels in var
  var labels = GmailApp.getUserLabels();

  //Iterates through all labels and breaks when it finds the Phish Label
  //If Phish Label is not found, returns false
  for (var i=0; i<labels.length; i++) 
    if(labels[i].getName() == labelToCheck)
      return true;
    if(i == (labels.length-1))
      return false
}

function isPhish(bodyToCheck)
{
  //Checks email headers to see if they contain key phishing phrases
  //Adds the phishing label to the thread if the phrases are found  
  if(bodyToCheck.indexOf("psm.knowbe4.com")>-1 || bodyToCheck.indexOf("X-PHISH-CRID")>-1)
    return true
  else
    return false
}
